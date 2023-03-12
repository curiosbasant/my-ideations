import { NextRequest, NextResponse } from 'next/server'
import { ServerValue } from 'firebase-admin/database'

import { database } from '~/utils/firebase.server'

export async function POST(req: NextRequest) {
  const { channelId, message } = await req.json()

  const hmm = await database.ref(`discord/messages`).push({
    content: message,
    channelId: channelId,
    createdAt: ServerValue.TIMESTAMP,
  })

  NextResponse.json({ id: hmm.key })
}
