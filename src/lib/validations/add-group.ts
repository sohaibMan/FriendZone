import { z } from 'zod'

export const GroupValidator = z.object({
  group_name: z.string(),
})
