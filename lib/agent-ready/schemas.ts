import { z } from "zod"

export const CheckStatusSchema = z.enum([
  "pass",
  "fail",
  "neutral",
  "unableToCheck",
])
export type CheckStatus = z.infer<typeof CheckStatusSchema>

export const EvidenceSchema = z
  .object({
    action: z.string().optional(),
    label: z.string().optional(),
    request: z
      .object({
        url: z.string().optional(),
        method: z.string().optional(),
      })
      .passthrough()
      .optional(),
    response: z
      .object({
        status: z.number().optional(),
        statusText: z.string().optional(),
        headers: z.record(z.string(), z.string()).optional(),
        bodyPreview: z.string().optional(),
      })
      .passthrough()
      .optional(),
    finding: z
      .object({
        outcome: z.string().optional(),
        summary: z.string().optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough()

export const CheckSchema = z
  .object({
    status: CheckStatusSchema,
    message: z.string().optional(),
    details: z.record(z.string(), z.unknown()).optional(),
    evidence: z.array(EvidenceSchema).optional(),
    durationMs: z.number().optional(),
  })
  .passthrough()

export const NextLevelRequirementSchema = z
  .object({
    check: z.string(),
    description: z.string().optional(),
    shortPrompt: z.string().optional(),
    prompt: z.string().optional(),
    specUrls: z.array(z.string()).optional(),
    skillUrl: z.string().optional(),
  })
  .passthrough()

export const IsItAgentReadyResponseSchema = z
  .object({
    url: z.string(),
    scannedAt: z.string(),
    level: z.number().int().min(0).max(5),
    levelName: z.string(),
    isCommerce: z.boolean().optional(),
    checks: z.record(z.string(), z.record(z.string(), CheckSchema)),
    commerceSignals: z.array(z.string()).optional(),
    nextLevel: z
      .object({
        target: z.number().int().optional(),
        name: z.string().optional(),
        requirements: z.array(NextLevelRequirementSchema).optional(),
      })
      .passthrough()
      .nullable()
      .optional(),
  })
  .passthrough()

export type IsItAgentReadyResponse = z.infer<typeof IsItAgentReadyResponseSchema>
export type CheckRecord = z.infer<typeof CheckSchema>
export type Evidence = z.infer<typeof EvidenceSchema>
export type NextLevelRequirement = z.infer<typeof NextLevelRequirementSchema>

export const ScanRequestSchema = z.object({
  url: z.string().min(1).max(2048),
})
