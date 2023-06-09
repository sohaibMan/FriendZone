import { z } from 'zod'

export const GroupValidator = z.object({
  group_name: z.string(),
})

export const InviteUserToGroupValidator = z.object({
    group_name: z.string(),
    user_name: z.string(),
})