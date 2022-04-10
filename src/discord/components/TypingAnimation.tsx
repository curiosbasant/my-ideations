export default function TypingAnimation() {
  return (
    <span className=" space-x-1">
      <span className="animate-loading inline-block h-2 w-2 rounded-full bg-slate-300" />
      <span className="animate-loading inline-block h-2 w-2 rounded-full bg-slate-300 [animation-delay:150ms]" />
      <span className="animate-loading inline-block h-2 w-2 rounded-full bg-slate-300 [animation-delay:300ms]" />
    </span>
  )
}
