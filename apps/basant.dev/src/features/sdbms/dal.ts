import { cache } from 'react'

import { api } from '~/lib/trpc'

export const getSessions = cache(() => {
  return api.sdbms.session.list()
})
