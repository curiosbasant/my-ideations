'use client'

import { useCallback, useState, type ComponentProps } from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'

import { useImmer } from '@my/core/immer'
import { getRandomNumberBetween } from '@my/lib/utils'

import { Button } from '~/components/ui/button'

export function MapEditor(props: { world: any }) {
  const [state, setState] = useImmer<{
    swatches: Record<string, string>
    coloredRegions: Record<string, string>
    selectedColor: string | null
  }>({
    swatches: {},
    coloredRegions: {},
    selectedColor: null,
  })

  return (
    <div className='bg-secondary grid size-full grid-cols-[2fr_1fr] p-2'>
      <div>
        <SvgMap
          data={props.world}
          data-selected-color={state.swatches[state.selectedColor]}
          getRegionColor={(d) =>
            state.swatches[state.coloredRegions[d.properties.dt_code]] || '#E5E7EB'
          }
          onRegionClick={(d) => {
            setState((prev) => {
              if (prev.selectedColor) {
                prev.coloredRegions[d.properties.dt_code] = prev.selectedColor
              } else {
                delete prev.coloredRegions[d.properties.dt_code]
              }
            })
          }}
        />
      </div>
      <div className='bg-background flex flex-col gap-2 rounded-xl border p-6'>
        <div>
          <Button
            onClick={() =>
              setState((prev) => {
                prev.swatches[Math.random().toString(36).slice(2)] =
                  '#' + getRandomNumberBetween(0xfff).toString(16).padStart(3, '0')
              })
            }>
            Add Swatch
          </Button>
          <ul className='mt-6 flex flex-wrap gap-4'>
            {Object.entries(state.swatches).map(([key, value]) => (
              <li key={key}>
                <button
                  className={`size-12 rounded-full ${state.selectedColor === key ? 'outline-primary outline-2 outline-offset-4' : ''}`}
                  style={{ backgroundColor: value }}
                  type='button'
                  onClick={() =>
                    setState((prev) => {
                      prev.selectedColor = key
                    })
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export function SvgMap({
  data,
  getRegionColor,
  onRegionClick,
  ...props
}: ComponentProps<'svg'> & {
  data: any
  getRegionColor: (region: string) => string
  onRegionClick: (region: string) => void
}) {
  const svgRef = useCallback((ref: SVGSVGElement) => {
    const svg = d3.select(ref)
    const [, , width, height] = svg.attr('viewBox').split(' ').map(parseFloat)
    const projection = d3.geoMercator()
    const pathGenerator = d3.geoPath().projection(projection)
    const countries = topojson.feature(data, data.objects.districts)
    projection.fitSize([width, height], countries)

    svg
      .append('g')
      .selectAll('path')
      .data(countries.features)
      .join('path')
      // The 'd' attribute for each country's path is created by the pathGenerator
      .attr('d', pathGenerator)
      .attr('class', 'rj-district')
      .attr('fill', (d) => getRegionColor(d))
      // Add a click event listener to each country path
      .on('click', function (event, d) {
        onRegionClick(d)
        const path = d3.select(this)
        path.attr('fill', ref.dataset.selectedColor)
      })

    return () => {
      ref.replaceChildren()
    }
  }, [])

  return <svg {...props} ref={svgRef} className='size-full' viewBox='0 0 960 500' />
}

/* function takeEffect(ref: SVGSVGElement) {
  d3.json(
    'https://cdn.jsdelivr.net/gh/udit-001/india-maps-data@bcbcba3/topojson/states/rajasthan.json',
  ).then((world) => {})

}
 */
