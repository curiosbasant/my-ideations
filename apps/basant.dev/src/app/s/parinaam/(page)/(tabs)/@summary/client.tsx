'use client'

import type { Ref } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Label,
  LabelList,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from 'recharts'
import type { LabelPosition } from 'recharts/types/component/Label'
import type { BaseAxisProps } from 'recharts/types/util/types'

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '~/components/ui/chart'
import { useElementSize } from '~/hooks/use-element-size'
import { useFilteredResults } from '../../query'
import type { ResultQueryOutput } from '../../shared'

export function ClassResultPieChart() {
  const results = useFilteredResults()
  const divisions = Object.entries(Object.groupBy(results, (row) => row.division))

  return (
    <ChartContainer
      className='aspect-square max-h-128 flex-1'
      config={divisions.reduce(
        (acc, [division], i) => (
          (acc[`division-${i + 1}`] = { label: division, color: `var(--chart-${i + 1})` }), acc
        ),
        {} as ChartConfig,
      )}>
      <PieChart accessibilityLayer>
        <Pie
          data={divisions}
          nameKey='0'
          dataKey={(a) => a[1].length}
          innerRadius={65}
          outerRadius='85%'
          label={{
            className: 'text-xl fill-foreground *:contents',
            dy: '0.25em',
          }}
          labelLine={{
            className: 'stroke-muted-foreground stroke-2',
          }}
          strokeWidth={5}>
          {divisions.map(([division], i) => (
            <Cell
              name={`division-${i + 1}`}
              fill={`var(--color-division-${i + 1})`}
              key={division}
            />
          ))}
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle' dominantBaseline='middle'>
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className='fill-foreground text-3xl font-bold'>
                      {results.length.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className='fill-muted-foreground'>
                      Total Students
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </Pie>
        <ChartLegend iconType='square' content={<ChartLegendContent />} />
        <ChartTooltip content={<ChartTooltipContent />} />
      </PieChart>
    </ChartContainer>
  )
}

export function ResponsiveClassToppersBarChart() {
  const [ref, layout] = useElementSize((size) => (size < 576 ? 'vertical' : 'horizontal'))
  return <div ref={ref}>{layout && <ClassToppersBarChart layout={layout} />}</div>
}

export function ClassToppersBarChart(props: {
  ref?: Ref<HTMLDivElement>
  /** @default 'horizontal' */
  layout?: 'vertical' | 'horizontal'
}) {
  const results = useFilteredResults()

  const top3 = getTop3Results(results).map((r) => ({
    studentName: `${r.name} / ${r.fName}`,
    subjects: r.subjects.map((s) => ({
      name: s.name,
      percentage: s.totalMarks,
    })),
  }))

  const isVertical = props.layout === 'vertical'
  const numberProps: BaseAxisProps = {
    type: 'number',
    tickCount: 6,
    domain: [50, 100],
    tickFormatter: (v: number) => `${v}%`,
  }
  const categoryProps: BaseAxisProps = {
    type: 'category',
    dataKey: 'studentName',
  }

  const [xAxisProps, yAxisProps] =
    isVertical ? [numberProps, categoryProps] : [categoryProps, numberProps]
  const [barRadius, labelPosition, aspectRatio]: [
    [number, number, number, number],
    LabelPosition,
    string,
  ] = isVertical ? [[0, 4, 4, 0], 'right', '9/16'] : [[4, 4, 0, 0], 'top', '16/9']

  return (
    <ChartContainer
      ref={props.ref}
      className='min-h-50 w-full'
      style={{ aspectRatio }}
      config={top3[0].subjects.reduce(
        (acc, s, i) => (
          (acc[`subject-${i + 1}`] = { label: s.name, color: `var(--chart-${i + 1})` }), acc
        ),
        {} as ChartConfig,
      )}>
      <BarChart
        data={top3}
        layout={props.layout}
        margin={{ [labelPosition]: 10 }}
        accessibilityLayer>
        <CartesianGrid
          className='stroke-secondary'
          stroke='none'
          horizontal={!isVertical}
          vertical={isVertical}
        />
        <YAxis {...yAxisProps} tickMargin={10} />
        <XAxis {...xAxisProps} tickMargin={10} />
        {top3[0].subjects.map((_, i) => (
          <Bar
            name={`subject-${i + 1}`}
            fill={`var(--color-subject-${i + 1})`}
            dataKey={`subjects.${i}.percentage`}
            radius={barRadius}>
            <LabelList dataKey={`subjects.${i}.percentage`} position={labelPosition} />
          </Bar>
        ))}
        <ChartLegend className='pt-5' iconType='square' content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  )
}

function getTop3Results(results: ResultQueryOutput[]) {
  if (!results[0].rank) return results.slice(-3)
  const top3: ResultQueryOutput[] = []
  for (const r of results) {
    if (r.rank < 4) {
      top3[r.rank - 1] = r
      if (top3[0] && top3[1] && top3[2]) break
    }
  }
  return top3
}
