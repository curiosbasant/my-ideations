'use client'

import { useCallback, useState, type ComponentProps } from 'react'
import * as d3 from 'd3'
import { XCircleIcon, XIcon } from 'lucide-react'
import * as topojson from 'topojson-client'

import { useImmer } from '@my/core/immer'
import { getRandomNumberBetween } from '@my/lib/utils'

import { Button } from '~/components/ui/button'
import { Label } from '~/components/ui/label'
import { Slider } from '~/components/ui/slider'

type Datum = d3.ExtendedFeature<
  d3.GeoGeometryObjects,
  {
    district: string
    dt_code: string
    st_code: string
    st_nm: string
    year: string
  }
>

export function MapEditor(props: { world: any }) {
  const [state, setState] = useImmer<{
    swatches: Record<string, number>
    regionSwatchMap: Record<string, string>
    selectedSwatch: string | null
    lightness: number
    chroma: number
  }>({
    swatches: {},
    regionSwatchMap: {},
    selectedSwatch: null,
    lightness: 75,
    chroma: 50,
  })

  const ppp = Object.entries(state.swatches)
  return (
    <div className='bg-secondary grid size-full grid-cols-[2fr_1fr] p-4'>
      <style>{`
        .swatch {
          --l: ${state.lightness};
          --c: ${state.chroma};
          --bg-fill: oklch(calc(var(--l) * 1%) calc(var(--c) * 1%) calc(var(--h) * 1deg));
          background-color: var(--bg-fill);
          fill: var(--bg-fill);
        }

        ${ppp.map(([key, value]) => `.swatch-${key} { --h: ${value} }`).join('\n')}
      `}</style>
      <SvgMap
        data={props.world}
        data-selected-color={state.selectedSwatch || ''}
        getRegionColor={(d) => {
          const regionCode = d.properties.dt_code
          return `swatch swatch-${state.regionSwatchMap[regionCode]}`
        }}
        onRegionClick={(d) => {
          setState((prev) => {
            if (prev.selectedSwatch) {
              prev.regionSwatchMap[d.properties.dt_code] = prev.selectedSwatch
            } else {
              delete prev.regionSwatchMap[d.properties.dt_code]
            }
          })
        }}
      />
      <div className='bg-background flex flex-col gap-6 rounded-xl border p-6'>
        <div className='space-y-4'>
          <Label>Lightness</Label>
          <Slider
            min={0}
            max={100}
            step={1}
            value={[state.lightness]}
            onValueChange={(value) => {
              setState((prev) => {
                prev.lightness = value[0]
              })
            }}
          />
        </div>
        <div className='space-y-4'>
          <Label>Chroma</Label>
          <Slider
            min={0}
            max={100}
            step={1}
            value={[state.chroma]}
            onValueChange={(value) => {
              setState((prev) => {
                prev.chroma = value[0]
              })
            }}
          />
        </div>
        {state.selectedSwatch && (
          <div className='space-y-4'>
            <Label>Hue</Label>
            <Slider
              min={0}
              max={360}
              step={1}
              value={[state.swatches[state.selectedSwatch]]}
              onValueChange={(value) => {
                setState((prev) => {
                  if (prev.selectedSwatch) {
                    prev.swatches[prev.selectedSwatch] = value[0]
                  }
                })
              }}
            />
          </div>
        )}
        <ul className='flex flex-wrap gap-4'>
          {ppp.map(([key, value]) => (
            <li
              className={`group relative rounded-full p-1 ${state.selectedSwatch === key ? 'border-primary border-2' : 'border'} size-12`}
              key={key}>
              <button
                className={`swatch swatch-${key} size-full rounded-full`}
                onClick={() =>
                  setState((prev) => {
                    prev.selectedSwatch = key
                  })
                }
                type='button'
              />
              <div className='bg-background absolute -end-1 -top-1 rounded-full border p-0.5 opacity-0 transition group-hover:opacity-100'>
                <button
                  className='block size-full'
                  onClick={() => {
                    setState((prev) => {
                      delete prev.swatches[key]
                    })
                  }}
                  type='button'>
                  <XIcon className='size-3.5' />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <Button
          onClick={() =>
            setState((prev) => {
              const id = Math.random().toString(36).slice(2)
              prev.swatches[id] = getRandomNumberBetween(360)
              // '#' + getRandomNumberBetween(0xfff).toString(16).padStart(3, '0')
              prev.selectedSwatch ??= id
            })
          }>
          Add Swatch
        </Button>
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
  getRegionColor: (region: Datum) => string
  onRegionClick: (region: Datum) => void
}) {
  const svgRef = useCallback((ref: SVGSVGElement) => {
    const svg = d3.select(ref)
    const [, , width, height] = svg.attr('viewBox').split(' ').map(parseFloat)
    const projection = d3.geoMercator()
    const pathGenerator = d3.geoPath().projection(projection)

    const countries: d3.ExtendedFeatureCollection<Datum> = topojson.feature(
      data,
      data.objects.districts,
    )
    projection.fitSize([width, height], countries)

    svg
      .append('g')
      .attr('stroke', 'black')
      .attr('fill', '#eee')
      .attr('stroke-width', 1)
      .selectAll('path')
      .data(countries.features)
      .join('path')
      .attr('d', pathGenerator)
      .attr('class', getRegionColor)
      .on('click', function (ev, d) {
        onRegionClick(d)
        const path = d3.select(this)
        if (ref.dataset.selectedColor) {
          path.attr('class', `swatch swatch-${ref.dataset.selectedColor}`)
        }
        // path.classed(`swatch-${ref.dataset.selectedColor}`, true)
      })

    return () => {
      ref.replaceChildren()
    }
  }, [])

  return <svg {...props} ref={svgRef} className='size-full' viewBox='0 0 960 500' />
}
