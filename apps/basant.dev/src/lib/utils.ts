import {
  createElement,
  type ComponentProps,
  type ElementType,
  type JSX,
  type ReactNode,
} from 'react'
import { cx, type CxOptions } from 'class-variance-authority'
import Zip from 'jszip'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: CxOptions) {
  return twMerge(cx(inputs))
}

export function styled<
  Tag extends keyof JSX.IntrinsicElements = keyof JSX.IntrinsicElements,
  Props extends { className?: string; children?: ReactNode } = ComponentProps<Tag>,
>(Comp: ElementType<Props, Tag>, className: string) {
  return (props: Props) => {
    const resolvedClassName = props.className ? cn(className, props.className) : className
    return createElement(Comp, { ...props, className: resolvedClassName }, props.children)
  }
}

export function prettifyText(text: string) {
  return text.replace(/\b\(/g, ' (').replace(/(\.|\,)\b/g, '$1 ')
}

export async function zipFiles(files: File[]) {
  const zip = new Zip()
  for (const file of files) {
    zip.file(file.name, file)
  }

  const zipBlob = await zip.generateAsync({ type: 'blob', compressionOptions: { level: 6 } })
  return new File([zipBlob], `combined-${Date.now()}.zip`, { type: 'application/zip' })
}

export function downloadFileFromUrl(url: string, fileName = '') {
  const aTag = document.createElement('a')
  aTag.setAttribute('href', url)
  aTag.setAttribute('download', fileName)
  aTag.style.visibility = 'hidden'
  document.body.appendChild(aTag)
  aTag.click()
  document.body.removeChild(aTag)
}
