```bash
/ tigent

  ai-powered github issue and pr labeling

> how it works?

  1. github webhook triggers on new issue/pr
  2. fetches your labels with descriptions
  3. ai picks matching labels
  4. applies labels automatically

> currently deployed on?

  vercel/ai (ai sdk)

> works on other repos?

  yes. install the app and add a .github/tigent.yml
  with a prompt tailored to your labels and workflow.

> stack?

  ai sdk · ai gateway · github app · vercel · octokit

> handbook?

  setup.md       → setup guide
  contribute.md  → contribution guidelines
```
