'use server'

import { api } from '~/lib/trpc'
import { createAction } from '~/lib/utils/helper-action/shared'

export const actionAddDocument = createAction(
  async (payload: { docNumber: string; filePath: string }) => {
    await api.person.document.set(payload)
  },
)
