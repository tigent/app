import type { Metadata } from 'next';
import { Card, Code, Header, Note, Prevnext, Section } from '../components';

export const metadata: Metadata = {
  title: 'Quickstart',
  description:
    'get tigent running with labels, blocklist, and the operator console.',
};

export default function Quickstart() {
  return (
    <article className="py-12">
      <Header
        section="Get Started"
        title="Quickstart"
        description="Set up label descriptions, add a blocklist, and watch the operator console after the first issue or pull request lands."
      />

      <Section id="steps" title="Four-Step Setup">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card
            title="1. Install"
            description="install the github app on the target repository."
          />
          <Card
            title="2. Describe Labels"
            description="add clear descriptions to your existing labels in github settings."
          />
          <Card
            title="3. Add Blocklist"
            description="protect workflow labels before the first automated triage run."
          />
          <Card
            title="4. Review Console"
            description="open the dashboard after a new issue or pr to inspect the result."
          />
        </div>
      </Section>

      <Section id="auth" title="Gateway Auth">
        <Note title="Auth Options">
          use either <code className="text-accent">AI_GATEWAY_API_KEY</code> or{' '}
          <code className="text-accent">VERCEL_OIDC_TOKEN</code>. if both are
          set, tigent will use the api key.
        </Note>
      </Section>

      <Section id="config" title="Starting Config">
        <Code>{`blocklist:
  - backport
  - major
  - minor

prompt: |
  when in doubt, add support.
  provider-specific issues get ai/provider and the matching provider label.`}</Code>
      </Section>

      <Section id="review" title="What To Review After The First Run">
        <Note title="Operator Checklist">
          look at the applied labels, any blocked labels, whether memory was
          used, and whether the maintainer would have made the same decision
          manually.
        </Note>
      </Section>

      <Prevnext />
    </article>
  );
}
