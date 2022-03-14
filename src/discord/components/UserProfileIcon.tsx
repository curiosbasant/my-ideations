export default function UserProfileIcon({
  ringColor,
  presence,
}: {
  ringColor: string
  presence?: "online" | "mobile" | "idle" | "dnd" | "offline"
}) {
  return (
    <div className="relative h-10 w-10 shrink-0 rounded-full bg-slate-500 shadow-inner">
      {presence && (
        <span
          className={`absolute bottom-0 right-0 ${
            presence == "mobile"
              ? "inline-flex flex-col items-center  gap-y-px rounded-sm bg-green-500 p-px pt-0.5 before:inline-block before:h-2 before:w-2 before:rounded-[1px] before:bg-slate-700 after:inline-block after:rounded-full after:bg-slate-700 after:p-0.5"
              : `h-3 w-3 rounded-full ${
                  presence == "online"
                    ? "bg-green-500"
                    : presence == "idle"
                    ? "bg-yellow-400 after:absolute after:-left-0.5 after:-top-0.5 after:inline-block after:h-2.5 after:w-2.5 after:rounded-full after:bg-slate-700"
                    : presence == "dnd"
                    ? "inline-flex items-center justify-center bg-rose-500 after:top-0 after:inline-block after:h-1 after:w-2.5 after:rounded-sm after:bg-slate-700"
                    : "border-[3px] border-slate-500 bg-slate-700"
                }`
          } ring-4 ring-${ringColor}`}
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
