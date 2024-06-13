import type { TextProps } from 'react-native'
import type FontAwesomeGlyphMap from '@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/FontAwesome5Free.json'
import FontAwesome5Icon from '@expo/vector-icons/FontAwesome5'
import { remapProps } from 'nativewind'

export type IconName = keyof typeof FontAwesomeGlyphMap
export type IconProps = TextProps & {
  name: IconName
  color?: string
  size?: number
}

export function Icon(props: IconProps) {
  return <FontAwesome5Icon {...props} />
}
Icon.displayName = 'ui/Icon'

remapProps(Icon, { className: 'style' })
