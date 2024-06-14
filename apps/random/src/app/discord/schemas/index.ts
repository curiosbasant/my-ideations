import { DocumentReference } from 'firebase-admin/firestore'
import z from 'zod'

const baseSchema = z.object({
  id: z.string(),
  name: z.string(),
})

export const serverSchema = baseSchema.extend({
  iconUrl: z.string().nullable().optional().default(null),
  position: z.number(),
  pingCount: z.number().default(0),
  description: z.string().nullable().default(null),
  group: z.custom<DocumentReference<ServerGroupType>>().optional(),
})
export type ServerType = z.infer<typeof serverSchema>

export const serverGroupSchema = baseSchema.extend({
  position: z.number(),
  color: z.string().optional(),
})
export type ServerGroupType = z.infer<typeof serverGroupSchema>

export const memberSchema = z.object({
  id: z.string(),
  nickname: z.string().nullish(),
  status: z.string().nullish(),
  description: z.string().nullable().default(null),
  user: z.custom<DocumentReference<ChannelType>>(),
})
export type MemberType = z.infer<typeof memberSchema>

export const channelSchema = baseSchema.extend({
  description: z.string().nullable().default(null),
  position: z.number(),
  pingCount: z.number().default(0),
  type: z.enum(['text', 'voice', 'category']),
})
export type ChannelType = z.infer<typeof channelSchema>

export const messageSchema = z.object({
  id: z.string(),
  content: z.string(),
  description: z.string().nullable().default(null),
  channelId: z.string(),
})
export type MessageType = z.infer<typeof messageSchema>
