import { App } from "octokit"
import { generateObject } from "ai"
import { z } from "zod"
import { parse } from "yaml"
import type { Octokit } from "octokit"

const app = new App({
	appId: process.env.GITHUB_APP_ID!,
	privateKey: process.env.GITHUB_APP_PRIVATE_KEY!.replace(/\\n/g, "\n"),
	webhooks: { secret: process.env.GITHUB_WEBHOOK_SECRET! },
})

app.webhooks.on("issues.opened", async ({ octokit, payload }) => {
	const owner = payload.repository.owner.login
	const repo = payload.repository.name
	const gh = { octokit, owner, repo }
	const config = await getconfig(gh)
	await triageissue(gh, config, payload.issue.number)
})

app.webhooks.on("pull_request.opened", async ({ octokit, payload }) => {
	const owner = payload.repository.owner.login
	const repo = payload.repository.name
	const gh = { octokit, owner, repo }
	const config = await getconfig(gh)
	await triagepr(gh, config, payload.pull_request.number)
})

export async function POST(req: Request) {
	const body = await req.text()
	try {
		await app.webhooks.verifyAndReceive({
			id: req.headers.get("x-github-delivery") || "",
			name: req.headers.get("x-github-event") as any,
			payload: body,
			signature: req.headers.get("x-hub-signature-256") || "",
		})
	} catch {}
	return new Response("ok")
}

interface Gh {
	octokit: Octokit
	owner: string
	repo: string
}

interface Config {
	confidence: number
	model: string
}

const defaultconfig: Config = {
	confidence: 0.6,
	model: "anthropic/claude-sonnet-4",
}

async function getconfig(gh: Gh): Promise<Config> {
	try {
		const { data } = await gh.octokit.rest.repos.getContent({
			owner: gh.owner,
			repo: gh.repo,
			path: ".github/tigent.yml",
			mediaType: { format: "raw" },
		})
		const yaml = data as unknown as string
		const parsed = parse(yaml) as Partial<Config>
		return { ...defaultconfig, ...parsed }
	} catch {
		return defaultconfig
	}
}

interface Label {
	name: string
	description: string
}

async function fetchlabels(gh: Gh): Promise<Label[]> {
	const { data } = await gh.octokit.rest.issues.listLabelsForRepo({
		owner: gh.owner,
		repo: gh.repo,
		per_page: 100,
	})
	return data.map((l) => ({ name: l.name, description: l.description || "" }))
}

async function addlabels(gh: Gh, issue: number, labels: string[]) {
	if (labels.length === 0) return
	await gh.octokit.rest.issues.addLabels({
		owner: gh.owner,
		repo: gh.repo,
		issue_number: issue,
		labels,
	})
}

async function react(gh: Gh, issue: number) {
	await gh.octokit.rest.reactions.createForIssue({
		owner: gh.owner,
		repo: gh.repo,
		issue_number: issue,
		content: "eyes",
	})
}

const schema = z.object({
	labels: z.array(z.string()),
	confidence: z.number().min(0).max(1),
	reasoning: z.string(),
})

async function triageissue(gh: Gh, config: Config, number: number) {
	await react(gh, number)

	const [issue, labels] = await Promise.all([
		gh.octokit.rest.issues.get({ owner: gh.owner, repo: gh.repo, issue_number: number }),
		fetchlabels(gh),
	])

	const labellist = labels
		.map((l) => (l.description ? `- ${l.name}: ${l.description}` : `- ${l.name}`))
		.join("\n")

	const { object } = await generateObject({
		model: config.model,
		schema,
		system: `you are a github issue classifier. assign labels based on the issue content.

available labels:
${labellist}

rules:
- only use labels from the list above
- pick labels that match the issue content
- use label descriptions to understand what each label means
- be conservative, only add labels you are confident about`,
		prompt: `title: ${issue.data.title}

body:
${issue.data.body || "no description"}`,
	})

	const valid = object.labels.filter((l) => labels.some((x) => x.name === l))
	if (object.confidence >= config.confidence && valid.length > 0) {
		await addlabels(gh, number, valid)
	}
}

async function triagepr(gh: Gh, config: Config, number: number) {
	await react(gh, number)

	const [pr, files, labels] = await Promise.all([
		gh.octokit.rest.pulls.get({ owner: gh.owner, repo: gh.repo, pull_number: number }),
		gh.octokit.rest.pulls.listFiles({
			owner: gh.owner,
			repo: gh.repo,
			pull_number: number,
			per_page: 100,
		}),
		fetchlabels(gh),
	])

	const labellist = labels
		.map((l) => (l.description ? `- ${l.name}: ${l.description}` : `- ${l.name}`))
		.join("\n")

	const filelist = files.data.map((f) => f.filename).join("\n")

	const { object } = await generateObject({
		model: config.model,
		schema,
		system: `you are a github pull request classifier. assign labels based on the pr content.

available labels:
${labellist}

rules:
- only use labels from the list above
- pick labels that match the pr content and changed files
- use label descriptions to understand what each label means
- be conservative, only add labels you are confident about`,
		prompt: `title: ${pr.data.title}

body:
${pr.data.body || "no description"}

changed files:
${filelist}`,
	})

	const valid = object.labels.filter((l) => labels.some((x) => x.name === l))
	if (object.confidence >= config.confidence && valid.length > 0) {
		await addlabels(gh, number, valid)
	}
}
