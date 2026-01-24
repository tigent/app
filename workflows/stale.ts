import { sleep, fetch } from "workflow";
import { SignJWT, importPKCS8 } from "jose";
import { parse } from "yaml";

interface StaleConfig {
	enabled: boolean;
	days: number;
	close: number;
	exempt: { labels: string[]; assignees: boolean };
	label: string;
	message: string;
	closemessage: string;
}

const defaultstale: StaleConfig = {
	enabled: false,
	days: 60,
	close: 7,
	exempt: { labels: [], assignees: false },
	label: "stale",
	message: "this issue has been inactive for {days} days and will be closed in {close} days if there is no further activity.",
	closemessage: "this issue has been closed due to inactivity.",
};

export async function stalechecker(
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

		if (config.enabled) {
			await checkstale(token, owner, repo, config);
		}

		await sleep("24h");
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
	const response = await globalThis.fetch(
		`https://api.github.com/repos/${owner}/${repo}/installation`,
		{
			headers: {
				accept: "application/vnd.github+json",
				authorization: `Bearer ${jwt}`,
				"x-github-api-version": "2022-11-28",
			},
		}
	);

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
		0x30, 0x82, 0x00, 0x00, 0x02, 0x01, 0x00, 0x30, 0x0d, 0x06, 0x09, 0x2a, 0x86, 0x48, 0x86, 0xf7,
		0x0d, 0x01, 0x01, 0x01, 0x05, 0x00, 0x04, 0x82, 0x00, 0x00,
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

async function getconfig(token: string, owner: string, repo: string): Promise<StaleConfig> {
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
			return defaultstale;
		}

		const yaml = await response.text();
		const parsed = parse(yaml) as { stale?: Partial<StaleConfig> };

		if (!parsed.stale) {
			return defaultstale;
		}

		return {
			...defaultstale,
			...parsed.stale,
			exempt: {
				labels: parsed.stale.exempt?.labels || [],
				assignees: parsed.stale.exempt?.assignees ?? false,
			},
		};
	} catch {
		return defaultstale;
	}
}

interface Issue {
	number: number;
	title: string;
	updated_at: string;
	labels: { name: string }[];
	assignees: { login: string }[];
}

async function checkstale(token: string, owner: string, repo: string, config: StaleConfig) {
	"use step";

	const issues = await fetchissues(token, owner, repo);
	const now = Date.now();
	const staledays = config.days * 24 * 60 * 60 * 1000;
	const closedays = config.close * 24 * 60 * 60 * 1000;

	for (const issue of issues) {
		const updated = new Date(issue.updated_at).getTime();
		const age = now - updated;
		const labels = issue.labels.map((l) => l.name);

		if (config.exempt.labels.some((l) => labels.includes(l))) continue;
		if (config.exempt.assignees && issue.assignees.length > 0) continue;

		const isstale = labels.includes(config.label);

		if (isstale && age > closedays) {
			await closeissue(token, owner, repo, issue.number, config.closemessage);
		} else if (!isstale && age > staledays) {
			const message = config.message
				.replace("{days}", String(config.days))
				.replace("{close}", String(config.close));
			await markstale(token, owner, repo, issue.number, config.label, message);
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

async function markstale(token: string, owner: string, repo: string, issue: number, label: string, message: string) {
	await globalThis.fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issue}/comments`, {
		method: "POST",
		headers: {
			accept: "application/vnd.github+json",
			authorization: `Bearer ${token}`,
			"x-github-api-version": "2022-11-28",
			"content-type": "application/json",
		},
		body: JSON.stringify({ body: message }),
	});

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

async function closeissue(token: string, owner: string, repo: string, issue: number, message: string) {
	await globalThis.fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issue}/comments`, {
		method: "POST",
		headers: {
			accept: "application/vnd.github+json",
			authorization: `Bearer ${token}`,
			"x-github-api-version": "2022-11-28",
			"content-type": "application/json",
		},
		body: JSON.stringify({ body: message }),
	});

	await globalThis.fetch(`https://api.github.com/repos/${owner}/${repo}/issues/${issue}`, {
		method: "PATCH",
		headers: {
			accept: "application/vnd.github+json",
			authorization: `Bearer ${token}`,
			"x-github-api-version": "2022-11-28",
			"content-type": "application/json",
		},
		body: JSON.stringify({ state: "closed", state_reason: "not_planned" }),
	});
}
