import type { Metadata } from 'next';
import { Header, Section, Prevnext } from '../components';

export const metadata: Metadata = {
  title: 'Labels',
  description:
    'How Tigent uses your GitHub labels and descriptions for classification.',
};

export default function Labels() {
  return (
    <article className="py-12">
      <Header
        section="Reference"
        title="Labels"
        description="How Tigent uses your existing labels."
      />

      <Section id="how-it-works" title="How it works">
        <p className="text-white/60 mb-4 max-w-2xl">
          Tigent reads all labels from your repository, including their
          descriptions. When an issue or PR is opened, the AI uses this
          information to decide which labels to apply.
        </p>
        <p className="text-white/60 max-w-2xl">
          Labels with good descriptions get better classification results.
        </p>
      </Section>

      <Section id="descriptions" title="Writing descriptions">
        <p className="text-white/60 mb-6 max-w-2xl">
          Add descriptions to your labels in GitHub: Settings &rarr; Labels
          &rarr; Edit.
        </p>
        <div className="space-y-4 max-w-2xl">
          <div className="border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-sm font-medium">
                bug
              </span>
            </div>
            <p className="text-white/50 text-sm">
              Something is not working as expected
            </p>
          </div>
          <div className="border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-1 bg-purple-500/20 text-purple-400 rounded text-sm font-medium">
                feature
              </span>
            </div>
            <p className="text-white/50 text-sm">
              New functionality or enhancement request
            </p>
          </div>
          <div className="border border-white/10 rounded-xl p-4">
            <div className="flex items-center gap-3 mb-2">
              <span className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-sm font-medium">
                documentation
              </span>
            </div>
            <p className="text-white/50 text-sm">
              Improvements or additions to docs
            </p>
          </div>
        </div>
      </Section>

      <Section id="tips" title="Tips">
        <ul className="space-y-3 max-w-2xl text-white/60">
          <li className="flex gap-3">
            <span className="text-accent">-</span>
            Be specific in descriptions so the AI knows when to apply each label
          </li>
          <li className="flex gap-3">
            <span className="text-accent">-</span>
            Use consistent terminology across your labels
          </li>
          <li className="flex gap-3">
            <span className="text-accent">-</span>
            Labels without descriptions will still work but may be less accurate
          </li>
        </ul>
      </Section>

      <Prevnext />
    </article>
  );
}
