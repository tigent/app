import type { Metadata } from 'next';
import { Header, Section, Code, Codeinline, Prevnext } from '../components';

export const metadata: Metadata = {
  title: 'Configuration',
  description: 'Optional configuration for Tigent GitHub triage bot.',
};

export default function Config() {
  return (
    <article className="py-12">
      <Header
        section="Reference"
        title="Configuration"
        description="Optional settings to customize Tigent behavior."
      />

      <Section id="overview" title="Overview">
        <p className="text-white/60 mb-4 max-w-2xl">
          Tigent works out of the box with no configuration. It reads your
          existing labels and their descriptions to determine how to classify
          issues and PRs. The default setup is configured for the Vercel AI SDK
          repository.
        </p>
        <p className="text-white/60 mb-4 max-w-2xl">
          To customize for your own repo, create a config file at:
        </p>
        <Codeinline className="mt-4">.github/tigent.yml</Codeinline>
        <p className="text-white/60 mt-4 max-w-2xl">
          The most important field is the prompt. Write rules that describe how
          your labels should be applied. Tigent reads your labels from GitHub at
          runtime, so the prompt just needs to explain when to use each one.
        </p>
      </Section>

      <Section id="options" title="Options">
        <div className="space-y-8 max-w-2xl">
          <div>
            <h3 id="model" className="text-lg font-semibold mb-2 text-white">
              model
            </h3>
            <p className="text-white/60 mb-4">
              AI model to use for classification. Tigent uses the AI SDK gateway
              format, so you can use any supported provider and model. Default:
              google/gemini-2.5-flash
            </p>
            <Codeinline>model: google/gemini-2.5-flash</Codeinline>
          </div>
        </div>
      </Section>

      <Section id="prompt" title="Prompt">
        <div className="space-y-8 max-w-2xl">
          <div>
            <h3
              id="prompt-option"
              className="text-lg font-semibold mb-2 text-white"
            >
              prompt
            </h3>
            <p className="text-white/60 mb-4">
              Freeform rules that get injected into the AI system prompt during
              classification. This is where Tigent learns your preferences for
              how labels should be applied. You can define rules for priority
              assignment, label disambiguation, edge cases, and anything else
              specific to your project.
            </p>
            <p className="text-white/60 mb-4">
              The prompt is automatically rewritten by AI when you correct a
              mistake using the feedback loop. Each correction updates the rules
              to prevent the same mistake in the future, so the prompt improves
              over time without manual editing.
            </p>
            <Code className="max-w-2xl">{`prompt: |
  crashes and errors are always bug.
  feature requests get feature, not enhancement.
  minor bugs get p1.`}</Code>
          </div>
        </div>
      </Section>

      <Section id="example" title="Full example">
        <p className="text-white/60 mb-6 max-w-2xl">A complete config file:</p>
        <Code className="max-w-2xl">{`prompt: |
  you are the labeling agent for my project.
  crashes and errors are always bug.
  feature requests get feature, not enhancement.
  when in doubt, add support.`}</Code>
      </Section>

      <Prevnext />
    </article>
  );
}
