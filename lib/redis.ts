import { Redis } from "@upstash/redis";

export const redis = new Redis({
	url: process.env.KV_REST_API_URL!,
	token: process.env.KV_REST_API_TOKEN!,
});

export async function getstalerunid(repoid: number): Promise<string | null> {
	return redis.get(`stale:${repoid}`);
}

export async function setstalerunid(repoid: number, runid: string): Promise<void> {
	await redis.set(`stale:${repoid}`, runid);
}

export async function deletestalerunid(repoid: number): Promise<void> {
	await redis.del(`stale:${repoid}`);
}
