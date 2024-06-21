import { Text, View, type TextInput } from 'react-native'
import { Link } from 'expo-router'

import { Controller, useForm, zodResolver } from '@my/core/hook-form'
import { useRefs } from '@my/core/hooks'
import { signUpSchema } from '@my/lib/schema/auth'

import { Button, Input, Screen } from '~/components/ui'
import { useRegisterMutation } from '~/features/auth'

export default function RegisterScreen() {
  const { mutate, isPending } = useRegisterMutation()

  return (
    <Screen loading={isPending} className='gap-10'>
      <RegisterForm loading={isPending} onSubmit={mutate} />
      <Text className='color-foreground text-center text-sm'>
        Already have an account?{' '}
        <Link href='/login' className='color-primary'>
          Login now!
        </Link>
      </Text>
    </Screen>
  )
}

function RegisterForm(props: { loading?: boolean; onSubmit(data: signUpSchema): void }) {
  const [fullNameRef, emailRef, passwordRef] = useRefs<TextInput | null>(null)
  const { control, handleSubmit, getValues } = useForm<signUpSchema>({
    resolver: zodResolver(signUpSchema),
  })

  return (
    <View className='gap-6'>
      <Controller
        control={control}
        name='fullName'
        render={({ field, fieldState }) => (
          <Input.Text
            ref={fullNameRef}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            label='Full Name'
            errorMessage={fieldState.error?.message}
            icon='user-tie'
            blurOnSubmit={false}
            autoCapitalize='words'
            autoComplete='name'
            spellCheck={false}
            returnKeyType='next'
            onSubmitEditing={() => emailRef.current?.focus()}
          />
        )}
      />
      <Controller
        control={control}
        name='mobileOrEmail'
        render={({ field, fieldState }) => (
          <Input.Email
            ref={emailRef}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            label='Email'
            errorMessage={fieldState.error?.message}
            blurOnSubmit={false}
            autoCapitalize='none'
            returnKeyType='next'
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
        )}
      />
      <Controller
        control={control}
        name='password'
        render={({ field, fieldState }) => (
          <Input.Secure
            ref={passwordRef}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            label='Password'
            icon='key'
            errorMessage={fieldState.error?.message}
            blurOnSubmit={Boolean(getValues('fullName')?.length)}
            autoComplete='new-password'
            returnKeyType='done'
            onSubmitEditing={() => {
              getValues('fullName')?.length
                ? handleSubmit(props.onSubmit)()
                : fullNameRef.current?.focus()
            }}
          />
        )}
      />

      <Button loading={props.loading} onPress={handleSubmit(props.onSubmit)}>
        Create Account
      </Button>
    </View>
  )
}
