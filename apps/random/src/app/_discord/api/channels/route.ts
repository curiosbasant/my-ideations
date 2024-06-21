import { NextRequest, NextResponse } from 'next/server'
import { randEmoji, randPhrase, randVerb, randWord } from '@ngneat/falso'

import { APPS, Timestamp } from '~/utils/firebase.server'
import { slugify } from '~/utils/general.util'

export async function POST(req: NextRequest) {
  const { serverId } = await req.json()

  const channel = await APPS.discord.collection(`channels`).add({
    name: randEmoji() + '-' + slugify(randVerb() + ' ' + randWord()),
    description: randPhrase(),
    position: 0,
    type: 'text',
    server: APPS.discord.collection('servers').doc(serverId),
    createdAt: Timestamp.now(),
  })

  return NextResponse.json({ id: channel.id })
}
