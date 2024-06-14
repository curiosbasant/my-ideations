export default function TypingAnimation() {
  return (
    <span className='contents space-x-1'>
      <span className='inline-block h-1.5 w-1.5 origin-center animate-loading rounded-full bg-slate-300' />
      <span className='inline-block h-1.5 w-1.5 origin-center animate-loading rounded-full bg-slate-300 [animation-delay:150ms]' />
      <span className='inline-block h-1.5 w-1.5 origin-center animate-loading rounded-full bg-slate-300 [animation-delay:300ms]' />
    </span>
  )
}
