import { NextRequest, NextResponse } from 'next/server'
import { randFullName, randQuote, randUuid } from '@ngneat/falso'

import { APPS, Timestamp } from '~/utils/firebase.server'

export async function POST(req: NextRequest) {
  const { serverId, userId = randUuid() } = await req.json()

  const hmm = await APPS.discord
    .collection(`servers/${serverId}/members`)
    .doc(userId)
    .create({
      nickname: randFullName(),
      status: randQuote(),
      user: APPS.discord.collection('users').doc(userId),
      joinedAt: Timestamp.now(),
    })

  NextResponse.json({ success: true })
}
