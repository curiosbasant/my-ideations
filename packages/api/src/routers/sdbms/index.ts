import { and, authUid, eq, schema } from '@my/db'
import { z } from '@my/lib/zod'

import { protectedProcedure, publicProcedure } from '../../trpc'
import { importFileProcedure } from './procedure-import-file'

export const sdbmsRouter = {
  session: {
    list: publicProcedure.query(({ ctx: { db } }) => {
      return db.select().from(schema.sd__session)
    }),
  },
  student: {
    connectProfile: protectedProcedure
      .input(
        z.object({
          srNo: z.string(),
          dob: z.string(),
        }),
      )
      .mutation(async ({ input, ctx: { rls } }) => {
        await rls(async (tx) => {
          const [row] = await tx
            .select({ personId: schema.person.id })
            .from(schema.person)
            .innerJoin(schema.sd__student, eq(schema.person.id, schema.sd__student.personId))
            .where(
              and(eq(schema.person.dob, input.dob), eq(schema.sd__student.admissionNo, input.srNo)),
            )

          await tx
            .update(schema.profile)
            .set({ personId: row.personId })
            .where(eq(schema.profile.createdBy, authUid))
        })
      }),
    importFile: importFileProcedure,
  },
}
