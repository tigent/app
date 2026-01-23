import { z } from 'zod'

export const testresult = z.object({
  hastests: z.boolean(),
  verified: z.boolean(),
  failswithoutfix: z.boolean().optional()
})

export const prverdict = z.object({
  score: z.number().min(1).max(10),
  verdict: z.enum(['skip', 'review', 'priority']),
  summary: z.string(),
  flags: z.array(z.string()).optional(),
  tests: testresult.optional()
})

export const issueverdict = z.object({
  urgency: z.enum(['low', 'medium', 'high', 'critical']),
  category: z.string(),
  assignee: z.string(),
  summary: z.string()
})

export type TestResult = z.infer<typeof testresult>
export type PrVerdict = z.infer<typeof prverdict>
export type IssueVerdict = z.infer<typeof issueverdict>
