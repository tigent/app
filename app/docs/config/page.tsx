import type { Metadata } from 'next';
import {
  Card,
  Code,
  Codeinline,
  Grid,
  Header,
  Note,
  Prevnext,
  Section,
} from '../components';

export const metadata: Metadata = {
  title: 'Configuration',
  description: 'configure blocklist, prompt, and model for tigent.',
};

export default function Config() {
  return (
    <article className="py-12">
      <Header
        section="Reference"
        title="Configuration"
        description="Use .github/tigent.yml to tell tigent how to classify, which model to use, and which labels must never be applied automatically."
      />

      <Section id="file" title="File Location">
        <p className="text-base leading-7 text-white/62">
          Tigent reads an optional repo config from:
        </p>
        <Codeinline>.github/tigent.yml</Codeinline>
        <Note title="Default Behavior">
          if the file is missing, tigent still runs. it reads label names and
          descriptions directly from github and uses the default model.
        </Note>
      </Section>

      <Section id="surfaces" title="The Three Config Surfaces">
        <Grid>
          <Card
            title="Blocklist"
            code="hard enforcement"
            description="top-level labels that tigent must never add on its own."
          />
          <Card
            title="Prompt"
            code="classification guidance"
            description="repo-specific instructions for how to map issue and pr content to labels."
          />
          <Card
            title="Model"
            code="runtime selection"
            description="override the default model when you need a different classification backend."
          />
        </Grid>
      </Section>

      <Section id="blocklist" title="Blocklist">
        <p className="text-base leading-7 text-white/62">
          Use <code className="text-accent">blocklist</code> for workflow labels
          such as backports, release markers, or anything maintainers want to
          apply manually.
        </p>
        <Code>{`blocklist:
  - backport
  - major
  - minor
  - pull request welcome
  - good first issue`}</Code>
        <Note title="Important">
          blocklist is enforced after model output in code. it is not prompt
          text, and memory does not bypass it.
        </Note>
      </Section>

      <Section id="prompt" title="Prompt">
        <p className="text-base leading-7 text-white/62">
          Use the prompt to shape classification, not to hold hard restrictions.
          it should explain label meaning, routing rules, and repo-specific
          conventions.
        </p>
        <Code>{`prompt: |
  you are the labeling agent for this repo.
  when in doubt, add support.
  provider-specific issues get ai/provider and the matching provider label.
  setup questions usually map to support.`}</Code>
      </Section>

      <Section id="model" title="Model">
        <p className="text-base leading-7 text-white/62">
          Tigent defaults to ai sdk 6 with{' '}
          <code className="text-accent">anthropic/claude-sonnet-4.6</code>.
        </p>
        <p className="mt-3 text-base leading-7 text-white/62">
          When you use the default model, tigent prefers bedrock through ai
          gateway and falls back to anthropic if bedrock is unavailable.
        </p>
        <Codeinline>model: anthropic/claude-sonnet-4.6</Codeinline>
      </Section>

      <Section id="example" title="Full Example">
        <Code>{`model: anthropic/claude-sonnet-4.6

blocklist:
  - backport
  - major
  - minor

prompt: |
  you are the labeling agent for this repo.
  when in doubt, add support.
  provider-specific issues get ai/provider and the matching provider label.
  setup questions usually map to support.`}</Code>
      </Section>

      <Prevnext />
    </article>
  );
}
