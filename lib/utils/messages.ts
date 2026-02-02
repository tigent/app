interface StaleContext {
  weeks: number;
}

interface OutdatedVersionContext {
  package: string;
  mentioned: string;
  current: string;
}

export const messages = {
  stale: (ctx: StaleContext) =>
    `This issue has been inactive for ${ctx.weeks} weeks. Closing for now — feel free to reopen if still relevant.`,

  outdatedVersion: (ctx: OutdatedVersionContext) =>
    `This issue references \`${ctx.package}\` version ${ctx.mentioned}, but the current version is ${ctx.current}. Closing as this may be resolved in newer versions. Please reopen if the issue persists on the latest version.`,
};

export type CloseReason = keyof typeof messages;
export type MessageContext<T extends CloseReason> = T extends 'stale'
  ? StaleContext
  : T extends 'outdatedVersion'
    ? OutdatedVersionContext
    : never;
