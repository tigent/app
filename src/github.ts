type Reaction = '+1' | '-1' | 'laugh' | 'confused' | 'heart' | 'hooray' | 'rocket' | 'eyes'

interface GithubConfig {
  token: string
  owner: string
  repo: string
}

export async function react(config: GithubConfig, issue: number, content: Reaction) {
  const response = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/issues/${issue}/reactions`,
    {
      method: 'POST',
      headers: {
        'accept': 'application/vnd.github+json',
        'authorization': `Bearer ${config.token}`,
        'x-github-api-version': '2022-11-28',
        'content-type': 'application/json'
      },
      body: JSON.stringify({ content })
    }
  )
  if (!response.ok && response.status !== 200) {
    throw new Error(`failed to add reaction: ${response.status}`)
  }
  return response.json()
}

export async function label(config: GithubConfig, issue: number, labels: string[]) {
  const response = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/issues/${issue}/labels`,
    {
      method: 'POST',
      headers: {
        'accept': 'application/vnd.github+json',
        'authorization': `Bearer ${config.token}`,
        'x-github-api-version': '2022-11-28',
        'content-type': 'application/json'
      },
      body: JSON.stringify({ labels })
    }
  )
  if (!response.ok) {
    throw new Error(`failed to add labels: ${response.status}`)
  }
  return response.json()
}

export async function fetchlabels(config: GithubConfig): Promise<string[]> {
  const response = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/labels`,
    {
      headers: {
        'accept': 'application/vnd.github+json',
        'authorization': `Bearer ${config.token}`,
        'x-github-api-version': '2022-11-28'
      }
    }
  )
  if (!response.ok) {
    throw new Error(`failed to fetch labels: ${response.status}`)
  }
  const data = await response.json() as { name: string }[]
  return data.map(l => l.name)
}

export async function comment(config: GithubConfig, issue: number, body: string) {
  const response = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/issues/${issue}/comments`,
    {
      method: 'POST',
      headers: {
        'accept': 'application/vnd.github+json',
        'authorization': `Bearer ${config.token}`,
        'x-github-api-version': '2022-11-28',
        'content-type': 'application/json'
      },
      body: JSON.stringify({ body })
    }
  )
  if (!response.ok) {
    throw new Error(`failed to add comment: ${response.status}`)
  }
  return response.json()
}

export interface PullRequest {
  title: string
  body: string
  html_url: string
  base: { ref: string }
}

export async function getpr(config: GithubConfig, number: number): Promise<PullRequest> {
  const response = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/pulls/${number}`,
    {
      headers: {
        'accept': 'application/vnd.github+json',
        'authorization': `Bearer ${config.token}`,
        'x-github-api-version': '2022-11-28'
      }
    }
  )
  if (!response.ok) {
    throw new Error(`failed to fetch pr: ${response.status}`)
  }
  return response.json() as Promise<PullRequest>
}

export interface Issue {
  title: string
  body: string
  html_url: string
  labels: { name: string }[]
}

export async function getissue(config: GithubConfig, number: number): Promise<Issue> {
  const response = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/issues/${number}`,
    {
      headers: {
        'accept': 'application/vnd.github+json',
        'authorization': `Bearer ${config.token}`,
        'x-github-api-version': '2022-11-28'
      }
    }
  )
  if (!response.ok) {
    throw new Error(`failed to fetch issue: ${response.status}`)
  }
  return response.json() as Promise<Issue>
}

export async function getdiff(config: GithubConfig, number: number): Promise<string> {
  const response = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/pulls/${number}`,
    {
      headers: {
        'accept': 'application/vnd.github.v3.diff',
        'authorization': `Bearer ${config.token}`,
        'x-github-api-version': '2022-11-28'
      }
    }
  )
  if (!response.ok) {
    throw new Error(`failed to fetch diff: ${response.status}`)
  }
  return response.text()
}

export async function getfiles(config: GithubConfig, number: number): Promise<string[]> {
  const response = await fetch(
    `https://api.github.com/repos/${config.owner}/${config.repo}/pulls/${number}/files`,
    {
      headers: {
        'accept': 'application/vnd.github+json',
        'authorization': `Bearer ${config.token}`,
        'x-github-api-version': '2022-11-28'
      }
    }
  )
  if (!response.ok) {
    throw new Error(`failed to fetch files: ${response.status}`)
  }
  const data = await response.json() as { filename: string }[]
  return data.map(f => f.filename)
}
