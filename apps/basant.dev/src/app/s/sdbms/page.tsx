import { resolveStringParam } from '@my/lib/utils'

import { FormSubmitButton } from '~/components/forms/client'
import { FormField } from '~/components/forms/shared'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { RadioGroup, RadioGroupItem } from '~/components/ui/radio-group'
import { SignInWithGoogleButton } from '~/features/auth/components/sign-in-with-google/client'
import { FormFieldSelectInstitute } from '~/features/sdbms/components/form-fields'
import { getUserRole } from '~/features/sdbms/dal'
import { getProfileDetails } from '~/features/user/dal'
import { FormConnectStudent, FormConnectTeacher } from './client'

export default async function SdbmsHomePage(props: PageProps<'/s/sdbms'>) {
  const profile = await getProfileDetails()
  if (!profile) return <SignInWithGoogleButton />

  if (profile.personId) {
    const role = await getUserRole()

    return (
      <div className='h-full'>
        {role === 'teacher' ?
          <p className='text-center font-bold text-emerald-500'>
            Congrats! You've now acquired the teacher role.
          </p>
        : role === 'student' ?
          <p className='text-center font-bold text-emerald-500'>
            Success! Your profile is now connected with the provided SR Number.
          </p>
        : null}
      </div>
    )
  }

  const searchParams = await props.searchParams
  const role = resolveStringParam(searchParams.role)

  return (
    <div className='h-full'>
      {role === 'teacher' ?
        <div className='@container mx-auto max-w-sm space-y-8'>
          <FormConnectTeacher className='@xl:grid-cols-3 grid grid-cols-2 gap-4'>
            <FormFieldSelectInstitute />
            <FormField label='First Name'>
              <Input className='backdrop-blur-2xs' name='firstName' required />
            </FormField>
            <FormField label='Last Name'>
              <Input className='backdrop-blur-2xs' name='lastName' />
            </FormField>
            <FormField className='col-span-full' label='Gender'>
              <RadioGroup className='grid-cols-[auto_1fr]' name='gender' required>
                <RadioGroupItem value='1' id='g1' />
                <Label htmlFor='g1'>Male</Label>
                <RadioGroupItem value='2' id='g2' />
                <Label htmlFor='g2'>Female</Label>
                <RadioGroupItem value='3' id='g3' />
                <Label htmlFor='g3'>Transgender</Label>
                <RadioGroupItem value='4' id='g4' />
                <Label htmlFor='g4'>Others</Label>
              </RadioGroup>
            </FormField>
            <div className='col-span-full flex justify-end'>
              <FormSubmitButton>Save</FormSubmitButton>
            </div>
          </FormConnectTeacher>
        </div>
      : role === 'student' ?
        <div className='@container mx-auto max-w-sm space-y-8'>
          <FormConnectStudent className='@xl:grid-cols-3 grid gap-4'>
            <FormField label='SR Number'>
              <Input className='backdrop-blur-2xs' name='srNo' required />
            </FormField>
            <FormField label='Date of Birth'>
              <Input className='backdrop-blur-2xs' name='dob' required type='date' />
            </FormField>
            <div className='col-span-full flex justify-end'>
              <FormSubmitButton>Submit</FormSubmitButton>
            </div>
          </FormConnectStudent>
        </div>
      : <form action='/' className='mx-auto grid max-w-xs grid-cols-2 gap-4'>
          <p className='col-span-full text-center text-xl font-bold'>What are you?</p>
          <Button name='role' value='teacher' type='submit'>
            Teacher
          </Button>
          <Button name='role' value='student' type='submit'>
            Student
          </Button>
        </form>
      }
    </div>
  )
}
