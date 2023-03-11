export default function TypingAnimation() {
  return (
    <span className='space-x-1'>
      <span className='inline-block h-2 w-2 animate-loading rounded-full bg-slate-300' />
      <span className='inline-block h-2 w-2 animate-loading rounded-full bg-slate-300 [animation-delay:150ms]' />
      <span className='inline-block h-2 w-2 animate-loading rounded-full bg-slate-300 [animation-delay:300ms]' />
    </span>
  )
}
