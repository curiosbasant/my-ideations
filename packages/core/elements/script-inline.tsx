import { IS_BROWSER } from '@my/lib/utils/browser'

export function ScriptInline(props: { children: string }) {
  return (
    <script
      type={IS_BROWSER ? 'text/plain' : 'text/javascript'}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: props.children }}
    />
  )
}
