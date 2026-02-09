import { and, authUid, eq, schema } from '@my/db'
import { z } from '@my/lib/zod'

import { protectedProcedure } from '../../../trpc'
import { importFileProcedure } from './import-file'

export const studentRouter = {
  connectProfile: protectedProcedure
    .input(
      z.object({
        srNo: z.string(),
        dob: z.string(),
      }),
    )
    .mutation(async ({ input, ctx: { rls } }) => {
      await rls(async (tx) => {
        await tx
          .update(schema.profile)
          .set({ personId: schema.person.id })
          .from(schema.person)
          .innerJoin(schema.sd__student, eq(schema.person.id, schema.sd__student.personId))
          .where(
            and(
              eq(schema.person.dob, input.dob),
              eq(schema.sd__student.admissionNo, input.srNo),
              eq(schema.profile.createdBy, authUid),
            ),
          )
      })
    }),
  importFile: importFileProcedure,
}
