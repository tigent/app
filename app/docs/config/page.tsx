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
              Minimum confidence threshold for applying labels. Range: 0.0 to
              1.0. Default: 0.6
            </p>
            <Codeinline>confidence: 0.7</Codeinline>
          </div>

          <div>
            <h3 id="model" className="text-lg font-semibold mb-2 text-white">
              model
            </h3>
            <p className="text-white/60 mb-4">
              AI model to use for classification. Default:
              google/gemini-2.5-flash
            </p>
            <Codeinline>model: google/gemini-2.5-flash</Codeinline>
          </div>
        </div>
      </Section>

      <Section id="example" title="Example">
        <p className="text-white/60 mb-6 max-w-2xl">A minimal config file:</p>
        <Code className="max-w-md">{`confidence: 0.7`}</Code>
      </Section>

      <Prevnext />
    </article>
  );
}
