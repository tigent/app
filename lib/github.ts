import { SignJWT, importPKCS8 } from "jose";

export interface AppConfig {
	appid: string;
	privatekey: string;
	owner: string;
	repo: string;
}

export async function gettoken(config: AppConfig): Promise<string> {
	const jwt = await createjwt(config.appid, config.privatekey);
	const installationid = await getinstallationid(jwt, config.owner, config.repo);

	const response = await fetch(
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
	const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/installation`, {
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

export async function fetchpaginated<T>(url: string, token: string, maxpages = 10): Promise<T[]> {
	const results: T[] = [];
	let nexturl: string | null = url;

	for (let page = 0; page < maxpages && nexturl; page++) {
		const response: Response = await fetch(nexturl, {
			headers: {
				accept: "application/vnd.github+json",
				authorization: `Bearer ${token}`,
				"x-github-api-version": "2022-11-28",
			},
		});

		if (!response.ok) break;

		const data = (await response.json()) as T[];
		results.push(...data);

		const link = response.headers.get("link");
		const match = link?.match(/<([^>]+)>;\s*rel="next"/);
		nexturl = match?.[1] || null;
	}

	return results;
}
