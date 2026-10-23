'use client'

import { saveDesignation } from '~/features/user/actions'

export function handleDesignationUpdate(fd: FormData) {
  const departmentId = fd.get('department') as string
  const designation = fd.get('designation') as string

  saveDesignation({ departmentId, designation })
}
