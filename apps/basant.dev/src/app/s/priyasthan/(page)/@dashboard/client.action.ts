'use client'

import { saveDesignation } from './server.action'

export function handleDesignationUpdate(fd: FormData) {
  const departmentId = fd.get('department') as string
  const designation = fd.get('designation') as string

  saveDesignation({ departmentId, designation })
}
