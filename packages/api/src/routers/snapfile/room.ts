import { TRPCError } from '@trpc/server'

import { schema } from '@my/db'
import { coalesce, desc, eq, extractJson } from '@my/db/sql'
import { sanitizeFilenameForStorage } from '@my/lib/utils'
import { z } from '@my/lib/zod'

import { objects } from '../../../../db/src/utils/helpers/supabase'
import { publicProcedure } from '../../trpc'

const roomProcedure = publicProcedure.input(
  z.object({
    slug: z.string().nonempty(),
  }),
)

export const roomRouter = {
  get: roomProcedure.query(({ input, ctx: { rls } }) => {
    return rls(async (tx) => {
      const [room] = await tx
        .select({
          id: schema.sf__room.id,
          name: schema.sf__room.name,
        })
        .from(schema.sf__room)
        .where(eq(schema.sf__room.slug, input.slug))
      if (!room) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'No record found' })
      }
      return room
    })
  }),
  file: {
    list: roomProcedure.query(async ({ input, ctx: { rls, supabase } }) => {
      const files = await rls((tx) =>
        tx
          .select({
            id: schema.sf__roomFile.id,
            path: schema.sf__roomFile.path,
            mimetype: extractJson(objects.metadata, 'mimetype').as<string>('mimetype'),
            size: extractJson(objects.metadata, 'size').mapWith(Number),
            lastModifiedAt: coalesce(
              schema.sf__roomFile.updatedAt,
              schema.sf__roomFile.createdAt,
            ).as('last_modified_at'),
          })
          .from(schema.sf__roomFile)
          .innerJoin(schema.sf__room, eq(schema.sf__room.id, schema.sf__roomFile.roomId))
          .leftJoin(objects, eq(objects.name, schema.sf__roomFile.path))
          .where(eq(schema.sf__room.slug, input.slug))
          .orderBy(desc(schema.sf__roomFile.createdAt))
          .limit(10),
      )
      const bkt = supabase.storage.from('sf__files')
      return files.map((file) => ({
        ...file,
        url: bkt.getPublicUrl(file.path).data.publicUrl,
      }))
    }),
    create: roomProcedure
      .input(
        z.object({
          fileName: z.string(),
        }),
      )
      .mutation(({ input, ctx: { rls } }) => {
        const filePath = sanitizeFilenameForStorage(input.fileName)

        return rls(async (tx) => {
          const [room] = await tx
            .select({
              id: schema.sf__room.id,
              name: schema.sf__room.name,
            })
            .from(schema.sf__room)
            .where(eq(schema.sf__room.slug, input.slug))
          if (!room) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'No record found' })
          }
          const values = {
            path: filePath,
            roomId: room.id,
          }
          await tx.insert(schema.sf__roomFile).values(values)
          return values
        })
      }),
  },
}
