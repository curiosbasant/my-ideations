import { useLocalSearchParams } from 'expo-router'

import { Controller, useForm, zodResolver } from '@my/core/hook-form'
import { groupMemberInviteSchema } from '@my/lib/schema/spend-buddy'

import { useGroupMemberInvite } from '~/features/group'
import { Button, Input, Screen } from '~/ui'

export default function GroupMemberInviteScreen() {
  const params = useLocalSearchParams<{ groupId: string }>()
  const { control, handleSubmit } = useForm<groupMemberInviteSchema>({
    resolver: zodResolver(groupMemberInviteSchema),
    defaultValues: {
      groupId: params.groupId!,
      userIdentity: '',
    },
  })

  const { isPending, mutate } = useGroupMemberInvite()

  const triggerSubmit = handleSubmit((data) => mutate(data))

  return (
    <Screen className='gap-6 p-8' waiting={isPending}>
      <Controller
        control={control}
        name='userIdentity'
        render={({ field, fieldState }) => (
          <Input.Email
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            label='Email'
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
