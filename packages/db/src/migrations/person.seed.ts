import { db } from '../client'
import { personCategory, personGender, personRelationType, personReligion } from '../schema/person'
import { personDocumentType } from '../schema/person-document'

export default () => {
  return db.transaction(async (tx) => {
    await Promise.all([
      tx
        .insert(personCategory)
        .values([
          { id: 1, name: 'GEN' },
          { id: 2, name: 'OBC' },
          { id: 3, name: 'SC' },
          { id: 4, name: 'ST' },
        ])
        .onConflictDoNothing(),
      tx
        .insert(personDocumentType)
        .values([
          { id: 1, name: 'Aadhar' },
          { id: 2, name: 'Jan-Aadhar' },
          { id: 3, name: 'PAN' },
          { id: 4, name: 'Driving License' },
        ])
        .onConflictDoNothing(),
      tx
        .insert(personGender)
        .values([
          { id: 1, name: 'Male' },
          { id: 2, name: 'Female' },
          { id: 3, name: 'Transgender' },
          { id: 4, name: 'Others' },
        ])
        .onConflictDoNothing(),
      tx
        .insert(personRelationType)
        .values([
          { id: 1, name: 'Father' },
          { id: 2, name: 'Mother' },
          { id: 3, name: 'Husband' },
        ])
        .onConflictDoNothing(),
      tx
        .insert(personReligion)
        .values([
          { id: 1, name: 'Hindu' },
          { id: 2, name: 'Muslim' },
          { id: 3, name: 'Sikh' },
          { id: 4, name: 'Isayi' },
        ])
        .onConflictDoNothing(),
    ])
  })
}
