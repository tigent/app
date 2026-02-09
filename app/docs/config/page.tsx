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
          issues and PRs.
        </p>
        <p className="text-white/60 max-w-2xl">
          If you want to customize the behavior, create a config file at:
        </p>
        <Codeinline className="mt-4">.github/tigent.yml</Codeinline>
      </Section>

      <Section id="options" title="Options">
        <div className="space-y-8 max-w-2xl">
          <div>
            <h3
              id="confidence"
              className="text-lg font-semibold mb-2 text-white"
            >
              confidence
            </h3>
            <p className="text-white/60 mb-4">
              When Tigent classifies an issue or PR, the AI returns a confidence
              score between 0.0 and 1.0. Labels are only applied if the score
              meets or exceeds this threshold. If the AI is unsure, the issue is
              left unlabeled rather than mislabeled.
            </p>
            <p className="text-white/60 mb-4">
              Lower values (0.3 - 0.5) label more issues but with less accuracy.
              Higher values (0.7 - 0.9) are more conservative and only label
              when the AI is highly confident. Default: 0.6
            </p>
            <Codeinline>confidence: 0.7</Codeinline>
          </div>

          <div>
            <h3 id="model" className="text-lg font-semibold mb-2 text-white">
              model
            </h3>
            <p className="text-white/60 mb-4">
              AI model to use for classification. Tigent uses the AI SDK gateway
              format, so you can use any supported provider and model. Default:
              openai/gpt-5-nano
            </p>
            <Codeinline>model: openai/gpt-5-nano</Codeinline>
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
        <Code className="max-w-2xl">{`confidence: 0.7

prompt: |
  crashes and errors are always bug.
  if the issue describes data loss or a crash, assign p0.
  minor bugs get p1.
  feature requests get feature, not enhancement.`}</Code>
      </Section>

      <Prevnext />
    </article>
  );
}
