import { db } from '../client'
import { personCategory, personGender, personRelationType, personReligion } from '../schema/person'
import { personDocumentType } from '../schema/person-document'
import { aliasExcluded } from '../utils/helpers/helpers'

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
          // Citizen Identity
          { id: 1010, name: 'Aadhar' },
          { id: 1020, name: 'Jan-Aadhar' },
          { id: 1030, name: 'PAN' },
          { id: 1040, name: 'Driving License' },
          { id: 1050, name: 'Voter Card' },
          { id: 1060, name: 'Ration Card' },
          { id: 1070, name: 'ABHA Card' },
          { id: 1080, name: 'Passport' },
          { id: 1090, name: 'Bank Passbook' },
          { id: 1100, name: 'APAAR/ABC' },
          // Academic
          { id: 2010, name: 'Secondary Marksheet' },
          { id: 2020, name: 'Senior Secondary Marksheet' },
          { id: 2030, name: 'Graduation Marksheet' },
          { id: 2040, name: 'Post Graduation Marksheet' },
          { id: 2050, name: 'NET' },
          { id: 2060, name: 'NEET' },
          { id: 2070, name: 'REET' },
          { id: 2080, name: 'Diploma' },
          // Certificates
          { id: 3000, name: 'Birth Certificate' },
          { id: 3000, name: 'Caste Certificate' },
          { id: 3000, name: 'Domicile Certificate' },
          { id: 3000, name: 'Marriage Certificate' },
          { id: 3000, name: 'CWSN Certificate' },
          { id: 3000, name: 'Character Certificate' },
          { id: 3000, name: 'Income Certificate' },
          { id: 3000, name: 'Death Certificate' },
          { id: 9000, name: 'Other Document' },
        ])
        .onConflictDoUpdate({
          target: personDocumentType.name,
          set: aliasExcluded(personDocumentType, (excluded) => ({
            id: excluded.id,
          })),
        }),
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
