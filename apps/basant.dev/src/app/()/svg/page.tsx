import { json } from 'd3-fetch'

import { MapEditor } from './client'

export default async function SvgPage() {
  const world = await json(
    'https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@bcbcba3/topojson/states/rajasthan.json',
  )

  return <MapEditor world={world} />
}
