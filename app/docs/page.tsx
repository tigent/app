import type { Metadata } from 'next';
import { Card, Grid, Header, Note, Prevnext, Section } from './components';

export const metadata: Metadata = {
  title: 'Introduction',
  description:
    'Tigent is an ai-powered github labeling agent with a blocklist, memory, and an operator console.',
};

export default function Docs() {
  return (
    <article className="py-12">
      <Header
        section="Get Started"
        title="Introduction"
        description="Tigent labels issues and pull requests with ai, keeps blocklist enforcement out of the model, and gives maintainers an operator console to review every decision."
      />

      <Section id="overview" title="What Tigent Includes">
        <Note title="Hosted Scope">
          the current hosted deployment is intentionally limited to the{' '}
          <code className="text-accent">vercel</code> and{' '}
          <code className="text-accent">tigent</code> organizations.
        </Note>
        <Grid>
          <Card
            title="Prompt"
            description="repo-specific classification guidance that tells tigent how to interpret your labels."
            code="soft guidance"
          />
          <Card
            title="Blocklist"
            description="hard enforcement for workflow labels that tigent must never apply automatically."
            code="hard enforcement"
          />
          <Card
            title="Memory"
            description="trusted maintainer corrections stored per repo and retrieved during later triage."
            code="durable recall"
          />
          <Card
            title="Operator Console"
            description="recent activity, blocked labels, and memory visibility in one review surface."
            code="review surface"
          />
        </Grid>
      </Section>

      <Section id="flow" title="How A Decision Flows">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card
            title="1. Read"
            description="tigent reads the issue or pr, label descriptions, repo config, and matching memory."
          />
          <Card
            title="2. Classify"
            description="claude sonnet 4.6 proposes labels, routed through bedrock first with anthropic fallback."
          />
          <Card
            title="3. Enforce"
            description="blocked labels are filtered out in code before any write happens."
          />
          <Card
            title="4. Record"
            description="the final decision is written to the dashboard and trusted feedback becomes memory."
          />
        </div>
      </Section>

      <Section id="benefits" title="Why The Design Is Split This Way">
        <Grid>
          <Card
            title="Safer Triage"
            description="workflow labels like backport, major, or minor can be blocked without hoping the prompt behaves."
          />
          <Card
            title="Clearer Feedback"
            description="maintainers can speak naturally to @tigent instead of memorizing a rigid command grammar."
          />
          <Card
            title="Inspectable Learning"
            description="corrections are visible in memory and config changes are verified before they count as improvement."
          />
        </Grid>
      </Section>

      <Section id="next" title="Where To Go Next">
        <div className="grid gap-4 md:grid-cols-2">
          <a
            href="/docs/quickstart"
            className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-5 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
              start
            </p>
            <h3 className="mt-3 text-xl font-semibold text-white">
              Quickstart
            </h3>
            <p className="mt-2 text-sm leading-6 text-white/62">
              set up labels, blocklist, and the first triage path.
            </p>
          </a>
          <a
            href="/docs/feedback"
            className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-5 transition-colors hover:border-white/20 hover:bg-white/[0.05]"
          >
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/35">
              teach
            </p>
            <h3 className="mt-3 text-xl font-semibold text-white">
              Feedback And Learning
            </h3>
            <p className="mt-2 text-sm leading-6 text-white/62">
              see how natural maintainer comments update labels, memory, and
              config.
            </p>
          </a>
        </div>
      </Section>

      <Prevnext />
    </article>
  );
}
