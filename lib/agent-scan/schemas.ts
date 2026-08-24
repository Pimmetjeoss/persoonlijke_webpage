import { z } from "zod"

export const ScoreBucketSchema = z.object({
  earned: z.number(),
  available: z.number(),
  passing: z.number().int(),
  total: z.number().int(),
})

export const BonusBucketSchema = z.object({
  points: z.number(),
  positive_signals: z.number().int(),
})

export const IssueSchema = z.object({
  id: z.string(),
  name: z.string(),
  tier: z.enum(["essential", "recommended", "bonus"]),
  result: z.enum(["failed", "partial"]),
  details: z.string().nullable().optional(),
  recommendation: z.string().nullable().optional(),
})

export const ReportSchema = z.object({
  target: z.string(),
  display_target: z.string(),
  report_url: z.string(),
  score: z.number().min(0).max(100).nullable(),
  score_label: z.string(),
  scanned_at: z.string(),
  eligible_checks: z.number().int(),
  score_breakdown: z.object({
    essential: ScoreBucketSchema,
    recommended: ScoreBucketSchema,
    bonus: BonusBucketSchema,
  }),
  issues: z.array(IssueSchema),
})

export type Report = z.infer<typeof ReportSchema>
export type Issue = z.infer<typeof IssueSchema>

export const ScanRequestSchema = z.object({
  url: z.string().min(1).max(2048),
})
