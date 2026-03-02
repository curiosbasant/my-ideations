import { db } from '../client'
import { feedbackType } from '../schema/feedback'

export default () => {
  return db.transaction(async (tx) => {
    await tx
      .insert(feedbackType)
      .values([
        { id: 1, name: '💬 General Feedback' },
        { id: 2, name: '✨ Feature Request' },
        { id: 3, name: '🪄 Suggestion' },
        { id: 4, name: '🪲 Bug Report' },
        { id: 5, name: '❓ Question / Support' },
        { id: 9, name: '🧺 Other' },
      ])
      .onConflictDoNothing()
  })
}
