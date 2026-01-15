import { publicProcedure } from '../../trpc'
import { importFileProcedure } from './procedure-import-file'

export const sdbmsRouter = {
  session: {
    list: publicProcedure.query(({ ctx: { db } }) => {
      return db.select().from(schema.sd__session)
    }),
  },
  student: {
    importFile: importFileProcedure,
  },
}
