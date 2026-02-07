import { db } from '../client'
import {
  sd__luExam,
  sd__luSession,
  sd__luStream,
  sd__luStudentStatus,
  sd__luSubject,
} from '../schema/sdbms'

export default () => {
  return db.transaction(async (tx) => {
    await Promise.all([
      tx
        .insert(sd__luExam)
        .values([
          { id: 1, name: '1st Term' },
          { id: 2, name: '2nd Term' },
          { id: 3, name: 'Half Yearly' },
          { id: 4, name: '3rd Term' },
          { id: 5, name: 'Final' },
        ])
        .onConflictDoNothing(),
      tx.insert(sd__luSession).values({ id: 2025, name: '2025-26' }).onConflictDoNothing(),
      tx
        .insert(sd__luStream)
        .values([
          { id: 1, name: 'Arts' },
          { id: 2, name: 'Commerce' },
          { id: 3, name: 'Science' },
          { id: 4, name: 'Agriculture' },
        ])
        .onConflictDoNothing(),
      tx
        .insert(sd__luStudentStatus)
        .values([
          { id: 1, name: 'Active' },
          { id: 2, name: 'Inactive' },
          { id: 3, name: 'Left with TC' },
          { id: 4, name: 'Left without TC' },
        ])
        .onConflictDoNothing(),
      tx
        .insert(sd__luSubject)
        .values([
          // Primary Subjects

          { id: 1010, name: 'Hindi' },
          { id: 1020, name: 'English' },
          { id: 1030, name: 'Mathematics' },
          { id: 1040, name: 'Environment Studies' },

          // Upper Primary Subjects

          { id: 2000, name: 'Sanskrit' },
          { id: 2010, name: 'Punjabi' },
          { id: 2020, name: 'Urdu' },
          { id: 2030, name: 'Rajasthani' },
          { id: 2040, name: 'Sindhi' },
          { id: 2050, name: 'Gujarati' },
          { id: 2100, name: 'Science' },
          { id: 2200, name: 'Social Science' },

          // Senior Secondary Subjects

          { id: 3000, name: 'Accountancy' },
          { id: 3010, name: 'Agriculture' },
          { id: 3020, name: 'Agriculture Biology' },
          { id: 3030, name: 'Agriculture Chemistry' },
          { id: 3040, name: 'Biology' },
          { id: 3050, name: 'Business Studies' },
          { id: 3060, name: 'Chemistry' },
          { id: 3070, name: 'Computer Science' },
          { id: 3080, name: 'Drawing' },
          { id: 3090, name: 'Economics' },
          { id: 3100, name: 'English Literature' },
          { id: 3110, name: 'English Shorthand' },
          { id: 3120, name: 'Environment Science' },
          { id: 3130, name: 'Geography' },
          { id: 3140, name: 'Geology' },
          { id: 3150, name: 'Gujarati Literature' },
          { id: 3160, name: 'Hindi Literature' },
          { id: 3170, name: 'Hindi Shorthand' },
          { id: 3180, name: 'History' },
          { id: 3190, name: 'Home Science' },
          { id: 3200, name: 'Information Practice' },
          { id: 3210, name: 'Music' },
          { id: 3220, name: 'Philosophy' },
          { id: 3230, name: 'Physical Education' },
          { id: 3240, name: 'Physics' },
          { id: 3250, name: 'Political Science' },
          { id: 3260, name: 'Psychology' },
          { id: 3270, name: 'Public Administration' },
          { id: 3280, name: 'Punjabi Literature' },
          { id: 3290, name: 'Rajasthani Literature' },
          { id: 3300, name: 'Sanskrit Literature' },
          { id: 3310, name: 'Sindhi Literature' },
          { id: 3320, name: 'Sociology' },
          { id: 3330, name: 'Typewriting English' },
          { id: 3340, name: 'Typewriting Hindi' },
          { id: 3350, name: 'Urdu Literature' },

          // Vocational Subjects

          { id: 9000, name: 'Vocational - Agriculture' },
          { id: 9010, name: 'Vocational - Apparel Made-Up & Home Furnishing' },
          { id: 9020, name: 'Vocational - Automotive/Automobile' },
          { id: 9030, name: 'Vocational - Banking Financial' },
          { id: 9040, name: 'Vocational - Beauty & Wellness' },
          { id: 9050, name: 'Vocational - Constructions' },
          { id: 9060, name: 'Vocational - Electrical & Electronics' },
          { id: 9070, name: 'Vocational - Electrical & Hardware' },
          { id: 9080, name: 'Vocational - Food Processing' },
          { id: 9090, name: 'Vocational - Health Care' },
          { id: 9100, name: 'Vocational - Information Technology' },
          { id: 9110, name: 'Vocational - Micro Irrigation' },
          { id: 9120, name: 'Vocational - Plumber' },
          { id: 9130, name: 'Vocational - Retail' },
          { id: 9140, name: 'Vocational - Security' },
          { id: 9150, name: 'Vocational - Telecom' },
          { id: 9160, name: 'Vocational - Travel & Tourism' },
        ])
        .onConflictDoNothing(),
    ])
  })
}
