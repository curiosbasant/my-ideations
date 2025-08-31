import { PlacesClient } from '@googlemaps/places'

export const placesClient = new PlacesClient({
  apiKey: process.env['NEXT_PUBLIC_GOOGLE_MAPS_API_KEY'],
})

export async function autocompletePlaces(search: string) {
  const [data] = await placesClient.autocompletePlaces({ input: search })
  if (!data.suggestions) return []

  return data.suggestions
    .map(({ placePrediction }) =>
      placePrediction?.placeId && placePrediction.structuredFormat?.mainText?.text ?
        {
          placeId: placePrediction.placeId,
          text: placePrediction.text?.text,
          mainText: placePrediction.structuredFormat?.mainText?.text,
          secondaryText: placePrediction.structuredFormat?.secondaryText?.text ?? null,
        }
      : null,
    )
    .filter((x) => x !== null)
}

export async function placeIdToLocation(placeId: string) {
  const [data] = await placesClient.getPlace(
    { name: `places/${placeId}` },
    {
      otherArgs: {
        headers: {
          'X-Goog-FieldMask': 'location',
        },
      },
    },
  )
  if (!data.location) throw new Error('No location found for placeId: ' + placeId)

  return data.location
}
