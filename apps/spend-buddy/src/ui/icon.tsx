import type { TextProps } from 'react-native'
import type MaterialCommunityGlyphMap from '@expo/vector-icons/build/vendor/react-native-vector-icons/glyphmaps/MaterialCommunityIcons.json'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import { remapProps } from 'nativewind'

export type IconName = keyof typeof MaterialCommunityGlyphMap
export type IconProps = TextProps & {
  name: IconName
  color?: string
  size?: number
}

export function Icon(props: IconProps) {
  return <MaterialCommunityIcons {...props} />
}
Icon.displayName = 'ui/Icon'

remapProps(Icon, { className: 'style' })
