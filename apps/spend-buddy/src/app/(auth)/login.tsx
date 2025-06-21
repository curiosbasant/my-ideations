import { Text, View, type TextInput } from 'react-native'
import { Link } from 'expo-router'

import { Controller, useForm, zodResolver } from '@my/core/hook-form'
import { useRefs } from '@my/core/hooks'
import { signInSchema } from '@my/lib/schema/auth'

import { useLoginMutation } from '~/features/auth'
import { AppVersion } from '~/features/global'
import { Button, Input, Screen } from '~/ui'

export default function LoginScreen() {
  const { mutate, isPending } = useLoginMutation()

  return (
    <Screen waiting={isPending} className='gap-10 p-8'>
      <LoginForm loading={isPending} onSubmit={mutate} />
      <Text className='text-center text-sm color-foreground'>
        Don't have an account yet?{' '}
        <Link href='/register' className='color-primary'>
          Create one now!
        </Link>
      </Text>
    </Screen>
  )
}

function LoginForm(props: { loading?: boolean; onSubmit(data: signInSchema): void }) {
  const [emailRef, passwordRef] = useRefs<TextInput | null>(null)
  const { control, handleSubmit, getValues } = useForm<signInSchema>({
    resolver: zodResolver(signInSchema),
  })

  return (
    <View className='gap-6'>
      <Controller
        control={control}
        name='userIdentity'
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
            blurOnSubmit={Boolean(getValues('userIdentity')?.length)}
            autoComplete='current-password'
            returnKeyType='done'
            onSubmitEditing={() => {
              getValues('userIdentity')?.length ?
                handleSubmit(props.onSubmit)()
              : emailRef.current?.focus()
            }}
          />
        )}
      />

      <Button loading={props.loading} onPress={handleSubmit(props.onSubmit)}>
        Login
      </Button>
      <AppVersion />
    </View>
  )
}
