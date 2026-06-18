import Image from 'next/image'

import { DataList, PvcCard } from '../components'
import anil from './anil_pp.jpeg'
import ashokLogo from './ashok-logo.svg'
import tri from './pat.jpg'

export default function CardPage() {
  return (
    <div
      className='flex h-full items-center justify-center gap-8 p-6 max-md:flex-col'
      style={{ '--p': '#6366f1', '--s': '#818cf8', '--a': '#4f46e5' }}>
      <PvcCard>
        <div className='absolute -z-10 aspect-square w-full translate-x-1/2 -translate-y-1/2 rotate-45 bg-(--p) opacity-50 outline-[4cqi] outline-(--s)'>
          <Image
            src={tri}
            alt='School Logo'
            className='size-full object-cover mix-blend-soft-light'
            width='550'
            height='876.55'
          />
        </div>
        <div className='pointer-events-none absolute bottom-0 -z-20 h-2/3 w-full mask-t-from-75%'>
          <div
            className='h-full opacity-[0.05] dark:invert'
            style={{ background: 'url(/public/bg-doodles-school.jpg) top / 100cqi' }}
          />
        </div>
        <CardFront />
      </PvcCard>
      <PvcCard>
        <CardBack />
      </PvcCard>
    </div>
  )
}

function CardFront() {
  return (
    <div className='flex h-full flex-col'>
      <div className='grid grid-cols-[12cqi_1fr_12cqi] items-center gap-[2cqi] p-[4cqi]'>
        <div className='row-span-2'>
          <Image
            src={ashokLogo}
            alt='School Logo'
            className='h-[14cqi] w-full object-contain'
            width='550'
            height='876.55'
          />
        </div>
        <div className='col-span-2'>
          <p className='inline-block rounded-[1cqi] bg-white/50 p-[1cqi] text-[5cqi] font-bold text-balance uppercase [text-box:trim-both_cap_alphabetic]'>
            Government of Rajasthan
          </p>
        </div>
        <div className='justify-self-center rounded-[1cqi] bg-(--a) px-[2cqi] py-[1cqi]'>
          <p className='text-center text-[3.5cqi] font-medium text-white uppercase [text-box:trim-both_cap_alphabetic]'>
            Education Department
          </p>
        </div>
      </div>
      <div className='relative mt-[2cqi] aspect-square w-9/20 self-center rounded-full shadow-md'>
        <div className='overflow-clip rounded-full border-[2cqi] border-(--s) bg-gray-300 shadow-inner'>
          <Image
            src={anil}
            alt='Student Photo'
            height={320}
            width={320}
            className='size-full object-contain'
          />
        </div>
      </div>
      <h1 className='mt-[6cqi] text-center text-[8cqi] font-bold uppercase [text-box:trim-both_cap_alphabetic]'>
        Anil <span className='text-(--p)'>Kumar</span>
      </h1>
      <p className='mt-[4cqi] text-center text-[4cqi] font-medium text-(--a) uppercase [text-box:trim-both_cap_alphabetic]'>
        Identity Card
      </p>
      <DataList
        className='mt-[4cqi] grid-cols-[2fr_3fr]'
        data={{
          'Employee ID': 'RJSK201833057299',
          "Father's Name": 'Shri Mukh Ram Bhaskar',
          'Date of Birth': '20-02-1994',
          Designation: 'Lecturer (Political Science)',
          'Posting Place': 'GSSS Hopardi, Phalodi (220180)',
        }}
      />
      <div className='mt-auto mb-[10cqi] flex items-center justify-around'>
        <p className='text-center text-[3cqi]'>
          Signature of
          <br />
          Card Holder
        </p>
        <p className='text-center text-[3cqi]'>
          Signature of
          <br />
          Incharge
        </p>
      </div>
    </div>
  )
}

function CardBack() {
  return (
    <div className='h-full'>
      <div className='flex h-full flex-col gap-[4cqi]'>
        <div className='border-y-[5cqi] border-t-(--p) border-b-(--s)' />
        <div className='flex flex-1 items-center justify-center self-center px-[5cqi] pb-[16cqi]'>
          <DataList
            className='gap-y-[3cqi] text-[4.25cqi]'
            data={{
              'Service Joining Date': '24-12-2018',
              Mobile: '+91 9828455009',
              Address: (
                <>
                  Vil-Birodi Badi,
                  <br />
                  Teh-Laxmangarh,
                  <br />
                  Sikar Rajasthan
                  <br />
                  (332316)
                </>
              ),
            }}
          />
        </div>
      </div>
      <div className='pointer-events-none absolute top-0 -z-10 size-full'>
        <div
          className='h-full opacity-[0.05] dark:invert'
          style={{ background: 'url(/public/bg-doodles-school.jpg) top / 100cqi' }}
        />
      </div>
    </div>
  )
}
