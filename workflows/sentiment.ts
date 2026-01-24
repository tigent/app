import { sleep } from "workflow";
import { parse } from "yaml";
import { gettoken as gettokenbase, fetchpaginated, type AppConfig } from "../lib/github";

interface SentimentConfig {
	enabled: boolean;
	noreply: { enabled: boolean; hours: number; mode: "workflow" | "reactive" | "both" };
	labels: { noreply?: string };
	actions: {
		webhook?: { url: string; events: string[] };
		mention?: { enabled: boolean; users: string[] | "auto"; message: string; events: string[] };
		comment?: { enabled: boolean; noreply?: string };
	};
	exempt: { labels: string[]; users: string[] };
}

const defaultsentiment: SentimentConfig = {
	enabled: false,
	noreply: { enabled: true, hours: 48, mode: "both" },
	labels: { noreply: "awaiting-response" },
	actions: {},
	exempt: { labels: [], users: [] },
};

export async function sentimentchecker(
	repoid: number,
	owner: string,
	repo: string,
	appid: string,
	privatekey: string
) {
	"use workflow";

	while (true) {
		const token = await gettoken(appid, privatekey, owner, repo);
		const config = await getconfig(token, owner, repo);

		if (config.enabled && config.noreply.enabled) {
			if (config.noreply.mode === "workflow" || config.noreply.mode === "both") {
				await checknoreply(token, owner, repo, config);
			}
		}

		await sleep("1h");
	}
}

async function gettoken(appid: string, privatekey: string, owner: string, repo: string): Promise<string> {
	"use step";
	return gettokenbase({ appid, privatekey, owner, repo });
}

async function getconfig(token: string, owner: string, repo: string): Promise<SentimentConfig> {
	"use step";

	try {
		const response = await globalThis.fetch(
			`https://api.github.com/repos/${owner}/${repo}/contents/.github/tigent.yml`,
			{
				headers: {
					accept: "application/vnd.github.raw+json",
					authorization: `Bearer ${token}`,
					"x-github-api-version": "2022-11-28",
				},
			}
		);

		if (!response.ok) {
			return defaultsentiment;
		}

		const yaml = await response.text();
		const parsed = parse(yaml) as { sentiment?: Partial<SentimentConfig> };

		if (!parsed.sentiment) {
			return defaultsentiment;
		}

		return {
			...defaultsentiment,
			...parsed.sentiment,
			noreply: { ...defaultsentiment.noreply, ...parsed.sentiment.noreply },
			labels: { ...defaultsentiment.labels, ...parsed.sentiment.labels },
			actions: { ...defaultsentiment.actions, ...parsed.sentiment.actions },
			exempt: {
				labels: parsed.sentiment.exempt?.labels || [],
				users: parsed.sentiment.exempt?.users || [],
			},
		};
	} catch {
		return defaultsentiment;
	}
}

interface Issue {
	number: number;
	title: string;
	body: string;
	created_at: string;
	labels: { name: string }[];
	user?: { login: string };
}

interface Comment {
	body: string;
	created_at: string;
	user: { login: string };
}

async function checknoreply(token: string, owner: string, repo: string, config: SentimentConfig) {
	"use step";

	const issues = await fetchissues(token, owner, repo);
	const teammembers = await getteammembers(token, owner, repo);

	for (const issue of issues) {
		if (config.exempt.labels.some((l) => issue.labels.map((x) => x.name).includes(l))) continue;
		if (config.exempt.users.includes(issue.user?.login || "")) continue;

		const labelname = config.labels.noreply;
		if (labelname && issue.labels.map((l) => l.name).includes(labelname)) continue;

		const comments = await getcomments(token, owner, repo, issue.number);
		const author = issue.user?.login;

		let lastauthortime = issue.created_at;
		for (const c of comments.slice().reverse()) {
			if (c.user.login === author) {
				lastauthortime = c.created_at;
				break;
			}
		}

		const hours = (Date.now() - new Date(lastauthortime).getTime()) / (1000 * 60 * 60);
		if (hours < config.noreply.hours) continue;

		const hasreply = comments.some(
			(c) => teammembers.includes(c.user.login) && new Date(c.created_at) > new Date(lastauthortime)
		);

		if (hasreply) continue;

		if (labelname) {
			await addlabel(token, owner, repo, issue.number, labelname);
		}

		if (config.actions.webhook?.events.includes("noreply")) {
			await sendwebhook(config.actions.webhook.url, {
				event: "noreply",
				repository: { owner, repo },
				issue: {
					number: issue.number,
					title: issue.title,
					url: `https://github.com/${owner}/${repo}/issues/${issue.number}`,
				},
				noreply: { hours: Math.floor(hours) },
			});
		}

		let mentionposted = false;
		if (config.actions.mention?.enabled && config.actions.mention.events.includes("noreply")) {
			let users: string[];
			if (config.actions.mention.users === "auto") {
				users = teammembers;
			} else {
				users = config.actions.mention.users;
			}
			if (users.length > 0) {
				const mentions = users.map((u) => `@${u}`).join(" ");
				const body = `${mentions}\n\n${config.actions.mention.message}`;
				await postcomment(token, owner, repo, issue.number, body);
				mentionposted = true;
			}
		}

		if (!mentionposted && config.actions.comment?.enabled && config.actions.comment.noreply) {
			await postcomment(token, owner, repo, issue.number, config.actions.comment.noreply);
		}
	}
}

async function fetchissues(token: string, owner: string, repo: string): Promise<Issue[]> {
	const url = `https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=100`;
	const data = await fetchpaginated<Issue & { pull_request?: unknown }>(url, token);
	return data.filter((i) => !i.pull_request);
}

async function getcomments(token: string, owner: string, repo: string, issue: number): Promise<Comment[]> {
	const url = `https://api.github.com/repos/${owner}/${repo}/issues/${issue}/comments?per_page=100`;
	return fetchpaginated<Comment>(url, token);
}

async function getteammembers(token: string, owner: string, repo: string): Promise<string[]> {
	const url = `https://api.github.com/repos/${owner}/${repo}/collaborators?per_page=100`;
	const collaborators = await fetchpaginated<{ login: string; role_name: string }>(url, token);
	return collaborators.filter((c) => ["admin", "maintain", "push"].includes(c.role_name)).map((c) => c.login);
}

async function addlabel(token: string, owner: string, repo: string, issue: number, label: string) {
	await globalThis.fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issue}/labels`, {
		method: "POST",
		headers: {
			accept: "application/vnd.github+json",
			authorization: `Bearer ${token}`,
			"x-github-api-version": "2022-11-28",
			"content-type": "application/json",
		},
		body: JSON.stringify({ labels: [label] }),
	});
}

async function postcomment(token: string, owner: string, repo: string, issue: number, body: string) {
	await globalThis.fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issue}/comments`, {
		method: "POST",
		headers: {
			accept: "application/vnd.github+json",
			authorization: `Bearer ${token}`,
			"x-github-api-version": "2022-11-28",
			"content-type": "application/json",
		},
		body: JSON.stringify({ body }),
	});
}

async function sendwebhook(
	url: string,
	payload: {
		event: string;
		repository: { owner: string; repo: string };
		issue: { number: number; title: string; url: string };
		noreply: { hours: number };
	}
) {
	const response = await globalThis.fetch(url, {
		method: "POST",
		headers: { "content-type": "application/json" },
		body: JSON.stringify(payload),
	});

	if (!response.ok && response.status === 429) {
		const retryafter = response.headers.get("retry-after");
		if (retryafter) {
			await new Promise((r) => setTimeout(r, parseInt(retryafter) * 1000));
			await globalThis.fetch(url, {
				method: "POST",
				headers: { "content-type": "application/json" },
				body: JSON.stringify(payload),
			});
		}
	}
}
