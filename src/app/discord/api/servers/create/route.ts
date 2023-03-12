import { NextRequest, NextResponse } from 'next/server'
import { randPhrase, randWord } from '@ngneat/falso'

import { APPS, Timestamp } from '~/utils/firebase.server'

export async function POST(req: NextRequest) {
  const serverName = randWord({ capitalize: true })
  const hmm = await APPS.discord.collection('servers').add({
    name: serverName,
    description: randPhrase(),
    position: 0,
    iconUrl: `https://i.pravatar.cc/150?u=${serverName}`,
    createdAt: Timestamp.now(),
  })

  NextResponse.json({ id: hmm.id })
}
