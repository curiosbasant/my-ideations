import { NextRequest, NextResponse } from 'next/server'
import { ServerValue } from 'firebase-admin/database'

import { database } from '~/utils/firebase.server'

export async function POST(req: NextRequest) {
  const { channelId, content } = await req.json()

  const message = await database.ref(`discord/messages`).push({
    content,
    channelId: channelId,
    createdAt: ServerValue.TIMESTAMP,
  })

  return NextResponse.json({ id: message.key })
}
