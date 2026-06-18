import Image from 'next/image'

import { DataList, PvcCard } from '../components'
import anil from './anil_pp.jpeg'
import schoolLogo from './school_logo_transparent.png'

const bottomDesign = (
  <div className='absolute inset-x-0 bottom-0 -z-10 flex h-[16cqi] items-end justify-center overflow-clip'>
    <div className='w-2/3 border-[3.75cqi] border-b-0 border-transparent border-t-(--s)' />
    <div
      className='absolute bottom-[4cqi] box-content aspect-square w-full justify-self-center border-[3cqi] border-(--s) outline-[10cqi] outline-offset-[2cqi] outline-(--p)'
      style={{ transform: 'scaleX(1.75) rotate(45deg)' }}
    />
  </div>
)

export default function CardPage() {
  return (
    <div
      className='flex h-full items-center justify-center gap-8 p-6 max-md:flex-col'
      style={{ '--p': '#0040a4', '--s': '#4c89f4', '--a': '#ea9c3a' }}>
      <PvcCard>
        <CardFront />
        {bottomDesign}
      </PvcCard>
      <PvcCard>
        <CardBack />
        {bottomDesign}
      </PvcCard>
    </div>
  )
}

function CardFront() {
  return (
    <div className='flex h-full flex-col'>
      <div className='isolate flex flex-col gap-[1cqi]'>
        <div className='z-10 flex items-center gap-[2cqi] p-[4cqi] pt-[3cqi] pb-0'>
          <div className='aspect-square shrink-0 rounded-full bg-white p-1'>
            <Image src={schoolLogo} alt='School Logo' className='size-[18cqi] object-contain' />
          </div>
          <div className=''>
            <p className='text-[5cqi] leading-tight font-bold text-balance uppercase'>
              GOVT. SENIOR SECONDARY SCHOOL HOPARDI
            </p>
            <p className='text-[3.5cqi] text-gray-500'>Phalodi, Rajasthan (342301)</p>
          </div>
        </div>
        <div className='relative flex flex-col items-center gap-[1cqi]'>
          <div
            className='absolute bottom-[35cqi] box-content aspect-square w-full justify-self-center border-[14cqi] border-(--s) outline-[3cqi] outline-offset-[2cqi] outline-(--p)'
            style={{ transform: 'scaleX(2) rotate(45deg)' }}
          />
          <div className='rounded-[3cqi] bg-(--a) px-[2cqi]'>
            <p className='text-center text-[3cqi] font-medium text-white uppercase'>
              Student Id Card
            </p>
          </div>
          <div className='relative aspect-square w-9/20 rounded-full shadow-md'>
            <div className='overflow-clip rounded-full border-[3cqi] border-white bg-gray-300 shadow-inner'>
              <Image
                src={anil}
                alt='Student Photo'
                height={320}
                width={320}
                className='size-full object-contain'
              />
            </div>
          </div>
        </div>
      </div>
      <div className='mt-[5.5cqi] flex flex-col items-center gap-[3cqi]'>
        <div className=''>
          <h1 className='text-[8cqi] font-bold uppercase [text-box:trim-both_cap_alphabetic]'>
            Anil <span className='text-(--s)'>Kumar</span>
          </h1>
          <p className='mt-[2cqi] text-center text-[4cqi] font-medium text-(--a) uppercase'>
            2026-27
          </p>
        </div>
        <DataList
          data={{
            'Admission No': '20211234',
            'Admission Date': '01-07-2021',
            Class: 'XI (A)',
            'Date of Birth': '15-08-2010',
            "Father's Name": 'Mr. Rajesh Kumar',
            Mobile: '+91 9876543210',
          }}
        />
      </div>
      <div className='mt-auto mb-[8cqi] grid grid-cols-2 justify-items-center'>
        <p className='col-start-2 text-center text-[3cqi] text-gray-500'>
          Signature of
          <br />
          Principal
        </p>
      </div>
      <div className='pointer-events-none absolute bottom-0 -z-10 h-2/3 w-full mask-t-from-75%'>
        <div
          className='h-full opacity-[0.05] dark:invert'
          style={{ background: 'url(/public/bg-doodles-school.jpg) top / 100cqi' }}
        />
      </div>
    </div>
  )
}

function CardBack() {
  return (
    <>
      <div className='flex h-full flex-col gap-[4cqi]'>
        <div className='border-y-[5cqi] border-t-(--p) border-b-(--s)' />
        <DataList
          className='flex-1 content-center gap-y-[2cqi] pb-[16cqi] text-[4.25cqi]'
          data={{
            'School NIC Code': '220180',
            'School UDise Code': '8150207301',
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
      <div className='pointer-events-none absolute top-0 -z-10 size-full'>
        <div
          className='h-full opacity-[0.05] dark:invert'
          style={{ background: 'url(/public/bg-doodles-school.jpg) top / 100cqi' }}
        />
      </div>
    </>
  )
}
