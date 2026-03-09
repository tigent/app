import type { Gh, Label } from '../app/api/webhook/triage';

export interface Mock {
  gh: Gh;
  state: {
    draft: boolean;
    title: string;
    body: string;
    yaml: string;
    comments: string[];
    reactions: string[];
    added: string[][];
    removed: string[];
    current: string[];
  };
}

export function mock(
  owner: string,
  repo: string,
  labels: Label[],
  current: string[] = [],
): Mock {
  const state = {
    draft: false,
    title: '',
    body: '',
    yaml: '',
    comments: [] as string[],
    reactions: [] as string[],
    added: [] as string[][],
    removed: [] as string[],
    current: [...current],
  };

  const octokit = {
    rest: {
      repos: {
        get: async () => ({ data: { default_branch: 'main' } }),
        getContent: async () => ({ data: { sha: 'base' } }),
        createOrUpdateFileContents: async (input: { content: string }) => {
          state.yaml = Buffer.from(input.content, 'base64').toString('utf8');
          return { data: {} };
        },
      },
      git: {
        getRef: async () => ({ data: { object: { sha: 'head' } } }),
        deleteRef: async () => ({}),
        createRef: async () => ({}),
      },
      pulls: {
        get: async () => ({
          data: {
            title: 'mock pull request',
            body: 'mock pull request body',
            html_url: `https://github.com/${owner}/${repo}/pull/1`,
            user: { login: 'maintainer' },
          },
        }),
        listFiles: async () => ({
          data: [],
        }),
        create: async (input: {
          title: string;
          body: string;
          draft?: boolean;
        }) => {
          state.title = input.title;
          state.body = input.body;
          state.draft = Boolean(input.draft);
          return {
            data: {
              html_url: `https://github.com/${owner}/${repo}/pull/1`,
            },
          };
        },
      },
      issues: {
        createComment: async (input: { body: string }) => {
          state.comments.push(input.body);
          return { data: {} };
        },
        addLabels: async (input: { labels: string[] }) => {
          state.added.push(input.labels);
          state.current = [...new Set([...state.current, ...input.labels])];
          return { data: [] };
        },
        listLabelsOnIssue: async () => ({
          data: state.current.map(name => ({ name })),
        }),
        removeLabel: async (input: { name: string }) => {
          state.removed.push(input.name);
          state.current = state.current.filter(
            name => name.toLowerCase() !== input.name.toLowerCase(),
          );
          return { data: [] };
        },
        listLabelsForRepo: async () => ({
          data: labels.map(label => ({
            name: label.name,
            description: label.description,
            color: label.color,
          })),
        }),
      },
      reactions: {
        createForIssueComment: async (input: { content: string }) => {
          state.reactions.push(input.content);
          return { data: {} };
        },
      },
    },
  } as unknown as Gh['octokit'];

  const gh = {
    owner,
    repo,
    octokit,
  } satisfies Gh;

  return { gh, state };
}
