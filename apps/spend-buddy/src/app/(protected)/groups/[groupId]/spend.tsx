import type { TextInput } from 'react-native'
import { useLocalSearchParams } from 'expo-router'

import { Controller, useForm, zodResolver } from '@my/core/hook-form'
import { useRefs } from '@my/core/hooks'
import { groupSpendCreateSchema } from '@my/lib/schema/spend-buddy'

import { Button, Input, Screen } from '~/components/ui'
import { useGroupSpendAdd } from '~/features/group'

export default function GroupSpendCreateScreen() {
  const params = useLocalSearchParams<{ groupId: string }>()
  const [amountRef, noteRef] = useRefs<TextInput | null>(null)
  const { control, handleSubmit } = useForm<groupSpendCreateSchema>({
    resolver: zodResolver(groupSpendCreateSchema),
    defaultValues: {
      groupId: params.groupId!,
      amount: 0,
      note: '',
    },
  })

  const { isPending, mutate } = useGroupSpendAdd()

  const triggerSubmit = handleSubmit((data) => mutate(data))

  return (
    <Screen className='gap-6' loading={isPending}>
      <Controller
        control={control}
        name='amount'
        render={({ field, fieldState }) => (
          <Input.Text
            ref={amountRef}
            value={field.value ? String(field.value) : ''}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            label='Spend Amount'
            errorMessage={fieldState.error?.message}
            blurOnSubmit={false}
            returnKeyType='next'
            onSubmitEditing={() => noteRef.current?.focus()}
          />
        )}
      />
      <Controller
        control={control}
        name='note'
        render={({ field, fieldState }) => (
          <Input.Text
            ref={noteRef}
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            label='Spend Note'
            optional
            errorMessage={fieldState.error?.message}
            returnKeyType='done'
            onSubmitEditing={triggerSubmit}
          />
        )}
      />
      <Button onPress={triggerSubmit}>Add</Button>
    </Screen>
  )
}
