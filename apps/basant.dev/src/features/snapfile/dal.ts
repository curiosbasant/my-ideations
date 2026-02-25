import { cache } from 'react'

import { dalDbOperation, dalVerifySuccess } from '~/lib/dal/helpers'
import { api } from '~/lib/trpc'

export const getRecentFormats = cache(
  async (payload: Parameters<typeof api.snapfile.format.list>[0]) => {
    return dalVerifySuccess(dalDbOperation(() => api.snapfile.format.list(payload)))
  },
)
