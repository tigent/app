import type { Metadata } from 'next';
import { Card, Grid, Header, Note, Prevnext, Section } from '../components';

export const metadata: Metadata = {
  title: 'Labels',
  description:
    'write better label descriptions and separate semantic labels from workflow labels.',
};

const labels = [
  {
    title: 'bug',
    text: 'something is not working as expected in the product or sdk.',
    style: 'bg-red-500/15 text-red-300',
  },
  {
    title: 'feature',
    text: 'new functionality, requested capability, or meaningful enhancement.',
    style: 'bg-emerald-500/15 text-emerald-300',
  },
  {
    title: 'documentation',
    text: 'changes or gaps in guides, api docs, examples, or reference material.',
    style: 'bg-sky-500/15 text-sky-300',
  },
];

export default function Labels() {
  return (
    <article className="py-12">
      <Header
        section="Reference"
        title="Labels"
        description="Tigent works best when labels are descriptive, semantic, and clearly separated from workflow-only markers that belong in the blocklist."
      />

      <Section
        id="descriptions"
        title="Write Descriptions That Teach The Model"
      >
        <p className="text-base leading-7 text-white/62">
          Tigent reads label descriptions from github every time it triages.
          better descriptions mean better classification without bloating the
          prompt.
        </p>
        <div className="grid gap-4 md:grid-cols-3">
          {labels.map(item => (
            <div
              key={item.title}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.03] px-5 py-5"
            >
              <span
                className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${item.style}`}
              >
                {item.title}
              </span>
              <p className="mt-4 text-sm leading-6 text-white/62">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="semantic" title="Semantic Labels Versus Workflow Labels">
        <Grid>
          <Card
            title="Semantic"
            description="labels like bug, support, documentation, or provider/openai can usually be inferred from content."
          />
          <Card
            title="Workflow"
            description="labels like backport, major, or good first issue usually depend on release process or maintainer judgment."
          />
        </Grid>
        <Note title="Best Practice">
          keep semantic labels available to the model and move workflow labels
          into <code className="text-accent">blocklist</code>.
        </Note>
      </Section>

      <Section id="tips" title="Label Design Tips">
        <Grid>
          <Card description="use consistent nouns and verbs across descriptions so related labels cluster naturally." />
          <Card description="avoid vague descriptions like misc or general unless you really want a catch-all label." />
          <Card description="if two labels overlap heavily, clarify the boundary in the descriptions or in the prompt." />
        </Grid>
      </Section>

      <Prevnext />
    </article>
  );
}
