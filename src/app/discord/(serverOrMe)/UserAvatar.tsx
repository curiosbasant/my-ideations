const userAvatarSizeMap = {
  xs: 'h-4 w-4',
  sm: 'h-6 w-6',
  md: 'h-8 w-8',
  lg: 'h-10 w-10',
}

export default function UserAvatar(props: {
  size?: keyof typeof userAvatarSizeMap
  ringColor: string
  presence?: 'online' | 'mobile' | 'idle' | 'dnd' | 'offline'
}) {
  return (
    <div
      className={`relative ${
        userAvatarSizeMap[props.size ?? 'md']
      } shrink-0 rounded-full bg-slate-500 shadow-inner`}>
      {props.presence && (
        <span
          className={`absolute bottom-0 right-0 ${
            props.presence == 'mobile'
              ? 'inline-flex flex-col items-center  gap-y-px rounded-sm bg-green-500 p-px pt-0.5 before:inline-block before:h-2 before:w-2 before:rounded-[1px] before:bg-slate-700 after:inline-block after:rounded-full after:bg-slate-700 after:p-0.5'
              : `h-3 w-3 scale-80 ${
                  props.presence == 'online'
                    ? 'bg-green-500'
                    : props.presence == 'idle'
                    ? 'bg-yellow-400 after:absolute after:-left-0.5 after:-top-0.5 after:inline-block after:h-2.5 after:w-2.5 after:rounded-full after:bg-slate-700'
                    : props.presence == 'dnd'
                    ? 'inline-flex items-center justify-center bg-rose-500 after:top-0 after:inline-block after:h-1 after:w-2.5 after:rounded-sm after:bg-slate-700'
                    : 'border-[3px] border-slate-500 bg-slate-700'
                } rounded-full`
          } ring-4 ring-${props.ringColor}`}
        />
      )}
    </div>
  )
}

/* 
Ring Color Classes
ring-slate-600
ring-slate-700
ring-slate-800
ring-slate-800/60
*/
