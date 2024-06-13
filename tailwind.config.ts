// @ts-expect-error - no types
import nativewind from 'nativewind/preset'
import type { Config } from 'tailwindcss'

export default {
  content: ['./src/(app|components)/**/*.tsx'],
  presets: [nativewind],
} satisfies Config
