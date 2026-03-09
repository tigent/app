import type { Metadata } from 'next';
import {
  Card,
  Code,
  Grid,
  Header,
  Note,
  Prevnext,
  Section,
} from '../components';

export const metadata: Metadata = {
  title: 'Installation',
  description: 'install tigent and understand the github permissions it needs.',
};

export default function Installation() {
  return (
    <article className="py-12">
      <Header
        section="Get Started"
        title="Installation"
        description="Install the github app, review the permissions, and start with a narrow scope before trusting the agent broadly."
      />

      <Section id="scope" title="Hosted Scope">
        <Note title="Current Deployment">
          the current hosted deployment is limited to the{' '}
          <code className="text-accent">vercel</code> and{' '}
          <code className="text-accent">tigent</code> organizations. if you need
          broader usage, self-hosting or a later hosted expansion is required.
        </Note>
      </Section>

      <Section id="install" title="Install The GitHub App">
        <p className="text-base leading-7 text-white/62">
          Install tigent on the repositories where you want automatic issue and
          pr triage.
        </p>
        <a
          href="https://github.com/apps/tigent"
          className="inline-flex items-center rounded-2xl bg-accent px-5 py-3 text-sm font-medium text-fg transition-opacity hover:opacity-90"
        >
          Install GitHub App
        </a>
      </Section>

      <Section id="permissions" title="Permissions">
        <Grid>
          <Card
            code="issues: write"
            description="apply and remove issue labels during triage and correction."
          />
          <Card
            code="pull_requests: write"
            description="apply and remove labels on pull requests."
          />
          <Card
            code="contents: read"
            description="read .github/tigent.yml from the repository."
          />
          <Card
            code="contents: write"
            description="open learning prs that update .github/tigent.yml when maintainers ask tigent to improve."
          />
        </Grid>
      </Section>

      <Section id="gateway" title="AI Gateway Auth">
        <p className="text-base leading-7 text-white/62">
          tigent can authenticate to ai gateway with either a static api key or
          a vercel oidc token.
        </p>
        <Code>{`AI_GATEWAY_API_KEY=your-vercel-ai-gateway-key

# or

VERCEL_OIDC_TOKEN=your-vercel-oidc-token`}</Code>
        <Note title="Choose One Path">
          if both are present, the api key is used. on vercel deployments, oidc
          is usually the cleaner default.
        </Note>
      </Section>

      <Section id="rollout" title="Recommended Rollout">
        <div className="grid gap-4 md:grid-cols-3">
          <Card
            title="1. Start Narrow"
            description="install on a single repo first and watch how labels behave."
          />
          <Card
            title="2. Add Blocklist"
            description="protect workflow labels before you rely on automation."
          />
          <Card
            title="3. Use Feedback"
            description="correct decisions early so memory and config evolve with maintainers."
          />
        </div>
      </Section>

      <Prevnext />
    </article>
  );
}
