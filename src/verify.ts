import { $ } from 'bun'
import type { TestResult } from './schema'

interface VerifyInput {
  repo: string
  pr: number
  base: string
  testcmd: string
}

export async function verifytests(input: VerifyInput): Promise<TestResult> {
  const workdir = `/tmp/verify-${input.pr}`

  await $`rm -rf ${workdir}`.quiet()
  await $`git clone --depth=50 ${input.repo} ${workdir}`.quiet()

  const testfiles = await findtests(workdir)
  if (testfiles.length === 0) {
    return { hastests: false, verified: false }
  }

  await $`cd ${workdir} && gh pr checkout ${input.pr}`.quiet()

  const prodfiles = await getprodchanges(workdir, input.base)

  for (const file of prodfiles) {
    await $`cd ${workdir} && git checkout ${input.base} -- ${file}`.quiet()
  }

  const result = await runtests(workdir, input.testcmd)

  await $`rm -rf ${workdir}`.quiet()

  return {
    hastests: true,
    verified: true,
    failswithoutfix: !result.success
  }
}

async function findtests(dir: string): Promise<string[]> {
  const result = await $`find ${dir} -name "*.test.*" -o -name "*.spec.*"`.quiet()
  return result.text().trim().split('\n').filter(Boolean)
}

async function getprodchanges(dir: string, base: string): Promise<string[]> {
  const result = await $`cd ${dir} && git diff --name-only ${base}...HEAD`.quiet()
  const files = result.text().trim().split('\n').filter(Boolean)
  return files.filter(f => !f.includes('.test.') && !f.includes('.spec.'))
}

async function runtests(dir: string, cmd: string): Promise<{ success: boolean }> {
  try {
    await $`cd ${dir} && ${cmd}`.quiet()
    return { success: true }
  } catch {
    return { success: false }
  }
}
