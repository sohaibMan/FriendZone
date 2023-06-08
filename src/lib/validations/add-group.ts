import { z } from 'zod'

export const addGroupValidator = z.object({
  group_name: z.string(),
})
