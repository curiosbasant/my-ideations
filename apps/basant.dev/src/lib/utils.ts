import { createElement, type ElementType, type ReactNode } from 'react'
import { cx, type CxOptions } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: CxOptions) {
  return twMerge(cx(inputs))
}

export function styled<
  Props extends { className?: string; children?: ReactNode },
  Tag extends keyof JSX.IntrinsicElements = keyof JSX.IntrinsicElements,
>(Comp: ElementType<Props, Tag>, className: string) {
  return (props: Props) => {
    const resolvedClassName = props.className ? cn(className, props.className) : className
    return createElement(Comp, { ...props, className: resolvedClassName }, props.children)
    // return (
    //   // @ts-expect-error
    //   <Comp {...props} className={resolvedClassName} />
    // )
  }
}

export function prettifyText(text: string) {
  return text.replace(/\b\(/g, ' (').replace(/(\.|\,)\b/g, '$1 ')
}
