import { and, authUid, eq, schema } from '@my/db'
import { z } from '@my/lib/zod'

import { protectedProcedure } from '../../../trpc'
import { importFileProcedure } from './import-file'

export const teacherRouter = {
  connectProfile: protectedProcedure
    .input(
      z.object({
        employeeId: z.string(),
        dob: z.string(),
      }),
    )
    .mutation(async ({ input, ctx: { rls } }) => {
      return rls(async (tx) => {
        await tx
          .update(schema.profile)
          .set({ personId: schema.person.id })
          .from(schema.person)
          .innerJoin(schema.sd__teacher, eq(schema.person.id, schema.sd__teacher.personId))
          .where(
            and(
              eq(schema.person.dob, input.dob),
              eq(schema.sd__teacher.employeeId, input.employeeId),
              eq(schema.profile.createdBy, authUid),
            ),
          )
      })
    }),
  importFile: importFileProcedure,
}
