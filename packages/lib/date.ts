import { formatDistanceToNow } from 'date-fns/formatDistanceToNow'

export { formatDistanceToNow } from 'date-fns/formatDistanceToNow'

export const formatDistance = <DateType extends Date>(date: DateType | number | string) =>
  formatDistanceToNow(date, { addSuffix: true })
