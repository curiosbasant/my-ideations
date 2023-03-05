export default function ChannelMessageSender() {
  return (
    <form
      className='flex h-12 items-center rounded-md bg-slate-500 shadow-md'
      onSubmit={(ev) => {
        ev.preventDefault()
      }}>
      <label className='px-4 font-icon text-3xl text-slate-300'>
        add_circle <input hidden name='' type='file' />
      </label>
      <div className='grow'>
        <input
          className='h-full w-full border-none bg-transparent p-0 text-slate-300 placeholder:text-slate-400 focus:outline-none focus:ring-0'
          placeholder='Message in #channel-name'
          type='text'
        />
      </div>
      <div className='flex shrink-0 divide-x divide-slate-400/75 text-slate-300'>
        <div className='space-x-2 px-4'>
          <button className='font-icon text-3xl leading-none hover:text-slate-200' type='button'>
            gif_box
          </button>
          <button className='font-icon text-3xl leading-none hover:text-slate-200' type='button'>
            insert_emoticon
          </button>
        </div>
        <div className='px-4'>
          <button
            className='font-icon text-3xl leading-none hover:text-slate-200 disabled:cursor-not-allowed disabled:text-slate-400'
            disabled>
            send
          </button>
        </div>
      </div>
    </form>
  )
}
