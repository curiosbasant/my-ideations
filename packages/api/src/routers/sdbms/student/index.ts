import { TRPCError } from '@trpc/server'

import { schema } from '@my/db'
import { authUserId } from '@my/db/db-functions'
import { and, eq } from '@my/db/sql'
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
        const [row] = await tx
          .update(schema.profile)
          .set({ personId: schema.person.id })
          .from(schema.person)
          .innerJoin(schema.sd__student, eq(schema.person.id, schema.sd__student.personId))
          .where(
            and(
              eq(schema.person.dob, input.dob),
              eq(schema.sd__student.admissionNo, input.srNo),
              eq(schema.profile.createdBy, authUserId),
            ),
          )
          .returning({ personId: schema.person.id })

        if (!row) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'No matching record found!' })
        }

        return row
      })
    }),
  importFile: importFileProcedure,
}
