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
  title: 'Feedback',
  description:
    'correct tigent, teach it naturally, and verify learning before it lands.',
};

export default function Feedback() {
  return (
    <article className="py-12">
      <Header
        section="Reference"
        title="Feedback"
        description="Mention @tigent in a comment to explain a decision, correct labels, update the blocklist, or teach a repo-specific rule in natural language."
      />

      <Section id="who" title="Who Can Use Feedback">
        <Note title="Trusted Authors Only">
          only repository owners, members, and collaborators can trigger
          feedback actions. comments from other users are ignored.
        </Note>
      </Section>

      <Section id="patterns" title="Explain Natural Message Patterns">
        <Grid>
          <Card
            title="Explain"
            description="ask why tigent chose labels and it will restate the decision with any blocked labels or memory it used."
          />
          <Card
            title="Correct"
            description="tell tigent the current labels are wrong and what they should be instead."
          />
          <Card
            title="Update Blocklist"
            description="tell tigent to leave specific workflow labels to humans and it can prepare a config change."
          />
        </Grid>
      </Section>

      <Section id="examples" title="Example Comments">
        <Code>{`@tigent why did you label this as a bug?
@tigent this should be support and ai/provider
@tigent remove documentation and add support
@tigent never apply backport automatically. update tigent.yml
@tigent leave major and minor to humans`}</Code>
      </Section>

      <Section id="memory" title="How Learning Works">
        <p className="text-base leading-7 text-white/62">
          Trusted corrections are stored as repo memory. future triage retrieves
          the most relevant examples and uses them as precedent alongside the
          prompt and available labels.
        </p>
        <Note title="Verification First">
          when tigent proposes a config change, it verifies that change against
          the issue or pr that triggered it. if verification fails, the learning
          pr becomes a draft instead of pretending the system improved.
        </Note>
      </Section>

      <Section id="clarify" title="When Tigent Asks For Clarification">
        <p className="text-base leading-7 text-white/62">
          If a maintainer says a decision is wrong but does not provide enough
          direction, tigent should ask a short follow-up rather than guessing.
          that keeps the learning loop high-signal.
        </p>
      </Section>

      <Prevnext />
    </article>
  );
}
