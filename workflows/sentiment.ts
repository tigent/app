import { sleep } from "workflow";
import { SignJWT, importPKCS8 } from "jose";
import { parse } from "yaml";

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

	const jwt = await createjwt(appid, privatekey);
	const installationid = await getinstallationid(jwt, owner, repo);

	const response = await globalThis.fetch(
		`https://api.github.com/app/installations/${installationid}/access_tokens`,
		{
			method: "POST",
			headers: {
				accept: "application/vnd.github+json",
				authorization: `Bearer ${jwt}`,
				"x-github-api-version": "2022-11-28",
			},
		}
	);

	const data = (await response.json()) as { token: string };
	return data.token;
}

async function createjwt(appid: string, privatekey: string): Promise<string> {
	const normalized = privatekey.replace(/\\n/g, "\n");
	const pkcs8 = convertpkcs1topkcs8(normalized);
	const key = await importPKCS8(pkcs8, "RS256");
	const now = Math.floor(Date.now() / 1000);

	return await new SignJWT({})
		.setProtectedHeader({ alg: "RS256" })
		.setIssuedAt(now - 60)
		.setExpirationTime(now + 600)
		.setIssuer(appid)
		.sign(key);
}

async function getinstallationid(jwt: string, owner: string, repo: string): Promise<string> {
	const response = await globalThis.fetch(`https://api.github.com/repos/${owner}/${repo}/installation`, {
		headers: {
			accept: "application/vnd.github+json",
			authorization: `Bearer ${jwt}`,
			"x-github-api-version": "2022-11-28",
		},
	});

	const data = (await response.json()) as { id: number };
	return String(data.id);
}

function convertpkcs1topkcs8(pem: string): string {
	if (pem.includes("BEGIN PRIVATE KEY")) {
		return pem;
	}

	const lines = pem.split("\n");
	const b64 = lines.filter((l) => !l.includes("-----")).join("");
	const der = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

	const pkcs8header = new Uint8Array([
		0x30, 0x82, 0x00, 0x00, 0x02, 0x01, 0x00, 0x30, 0x0d, 0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7, 0x0d,
		0x01, 0x01, 0x01, 0x05, 0x00, 0x04, 0x82, 0x00, 0x00,
	]);

	const keylen = der.length;
	const totallen = pkcs8header.length + keylen;

	pkcs8header[2] = ((totallen - 4) >> 8) & 0xff;
	pkcs8header[3] = (totallen - 4) & 0xff;
	pkcs8header[pkcs8header.length - 2] = (keylen >> 8) & 0xff;
	pkcs8header[pkcs8header.length - 1] = keylen & 0xff;

	const pkcs8 = new Uint8Array(totallen);
	pkcs8.set(pkcs8header);
	pkcs8.set(der, pkcs8header.length);

	const b64out = btoa(String.fromCharCode(...pkcs8));
	const formatted = b64out.match(/.{1,64}/g)?.join("\n") || b64out;

	return `-----BEGIN PRIVATE KEY-----\n${formatted}\n-----END PRIVATE KEY-----`;
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

		const labelname = config.labels.noreply;
		if (labelname && !issue.labels.map((l) => l.name).includes(labelname)) {
			await addlabel(token, owner, repo, issue.number, labelname);
		}

		if (config.actions.webhook?.events.includes("noreply")) {
			await sendwebhook(config.actions.webhook.url, {
				event: "noreply",
				repository: { owner, repo },
				issue: { number: issue.number, title: issue.title, url: `https://github.com/${owner}/${repo}/issues/${issue.number}` },
				noreply: { hours: Math.floor(hours) },
			});
		}

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
			}
		}

		if (config.actions.comment?.enabled && config.actions.comment.noreply) {
			await postcomment(token, owner, repo, issue.number, config.actions.comment.noreply);
		}
	}
}

async function fetchissues(token: string, owner: string, repo: string): Promise<Issue[]> {
	const response = await globalThis.fetch(
		`https://api.github.com/repos/${owner}/${repo}/issues?state=open&per_page=100`,
		{
			headers: {
				accept: "application/vnd.github+json",
				authorization: `Bearer ${token}`,
				"x-github-api-version": "2022-11-28",
			},
		}
	);

	const data = (await response.json()) as (Issue & { pull_request?: unknown })[];
	return data.filter((i) => !i.pull_request);
}

async function getcomments(token: string, owner: string, repo: string, issue: number): Promise<Comment[]> {
	const response = await globalThis.fetch(
		`https://api.github.com/repos/${owner}/${repo}/issues/${issue}/comments?per_page=50`,
		{
			headers: {
				accept: "application/vnd.github+json",
				authorization: `Bearer ${token}`,
				"x-github-api-version": "2022-11-28",
			},
		}
	);

	return response.json() as Promise<Comment[]>;
}

async function getteammembers(token: string, owner: string, repo: string): Promise<string[]> {
	const response = await globalThis.fetch(`https://api.github.com/repos/${owner}/${repo}/collaborators`, {
		headers: {
			accept: "application/vnd.github+json",
			authorization: `Bearer ${token}`,
			"x-github-api-version": "2022-11-28",
		},
	});

	if (!response.ok) return [];

	const collaborators = (await response.json()) as { login: string; role_name: string }[];
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
	try {
		await globalThis.fetch(url, {
			method: "POST",
			headers: { "content-type": "application/json" },
			body: JSON.stringify(payload),
		});
	} catch {}
}
