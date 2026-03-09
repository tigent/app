export interface Scope {
  owners: string[];
  repos: string[];
}

function parse(value?: string) {
  return (value || '')
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
}

export function readscope(): Scope {
  const owners = parse(process.env.TIGENT_ALLOWED_OWNERS);
  return {
    owners: owners.length > 0 ? owners : ['vercel', 'tigent'],
    repos: parse(process.env.TIGENT_ALLOWED_REPOS).map(item =>
      item.toLowerCase(),
    ),
  };
}

export function allowed(owner: string, repo: string) {
  const scope = readscope();
  if (scope.owners.some(item => item.toLowerCase() === owner.toLowerCase()))
    return true;
  return scope.repos.includes(`${owner}/${repo}`.toLowerCase());
}
