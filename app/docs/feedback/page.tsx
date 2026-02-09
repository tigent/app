import type { Metadata } from 'next';
import { Header, Section, Code, Codeinline, Prevnext } from '../components';

export const metadata: Metadata = {
  title: 'Feedback',
  description: 'Teach Tigent by correcting its labeling decisions.',
};

export default function Feedback() {
  return (
    <article className="py-12">
      <Header
        section="Reference"
        title="Feedback"
        description="Correct labeling mistakes and teach Tigent over time."
      />

      <Section id="commands" title="Commands">
        <p className="text-white/60 mb-6 max-w-2xl">
          Mention @tigent in any comment to interact with it. Tigent uses AI to
          understand your intent, so you can write naturally. Only users listed
          in your config can use these commands.
        </p>

        <div className="space-y-8 max-w-2xl">
          <div>
            <h3 id="why" className="text-lg font-semibold mb-2 text-white">
              explain
            </h3>
            <p className="text-white/60 mb-4">
              Ask Tigent to explain why it assigned certain labels. It
              re-classifies the issue and posts its reasoning.
            </p>
            <Code className="max-w-2xl">{`@tigent why did you label this as a bug?
@tigent explain your reasoning
@tigent why`}</Code>
          </div>

          <div>
            <h3 id="wrong" className="text-lg font-semibold mb-2 text-white">
              correct
            </h3>
            <p className="text-white/60 mb-4">
              Tell Tigent the labels are wrong and what they should be. It
              removes incorrect labels, applies the right ones, and opens a PR
              to update the prompt so it learns from the correction.
            </p>
            <Code className="max-w-2xl">{`@tigent this is wrong, should be support and ai/provider
@tigent these labels are incorrect, it's a bug not a feature
@tigent wrong, should be bug, p1`}</Code>
          </div>
        </div>
      </Section>

      <Section id="learning" title="Learning">
        <p className="text-white/60 mb-4 max-w-2xl">
          Tigent stores its knowledge as a freeform prompt in your config file.
          When you correct a mistake, Tigent sends the current prompt along with
          the correction context (issue title, wrong labels, correct labels) to
          an AI that rewrites the rules to prevent the same mistake in the
          future.
        </p>
        <p className="text-white/60 mb-4 max-w-2xl">
          The updated prompt is committed to a new branch and a PR is opened for
          review. Once merged, all future classifications use the improved
          rules. Over time, the prompt becomes a detailed guide tailored to your
          project.
        </p>
        <Code className="max-w-2xl">{`confidence: 0.7

prompt: |
  crashes and errors are always bug.
  feature requests get feature, not enhancement.`}</Code>
      </Section>

      <Section id="permissions" title="Permissions">
        <p className="text-white/60 max-w-2xl">
          Only repository owners, members, and collaborators can use feedback
          commands. Comments from other users are ignored.
        </p>
      </Section>

      <Prevnext />
    </article>
  );
}
