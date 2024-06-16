import { Controller, useForm, zodResolver } from '@my/core/hook-form'
import { groupCreateSchema } from '@my/lib/schema/spend-buddy'

import { Button, Input, Screen } from '~/components/ui'
import { useGroupCreate } from '~/features/group'

export default function GroupCreateScreen() {
  const { isPending, mutate } = useGroupCreate()

  const { control, handleSubmit } = useForm<groupCreateSchema>({
    resolver: zodResolver(groupCreateSchema),
  })

  return (
    <Screen className='gap-6' loading={isPending}>
      <Controller
        control={control}
        name='name'
        render={({ field, fieldState }) => (
          <Input.Text
            value={field.value}
            onChangeText={field.onChange}
            onBlur={field.onBlur}
            label='Group Name'
            errorMessage={fieldState.error?.message}
            blurOnSubmit={false}
            returnKeyType='done'
            onSubmitEditing={() => handleSubmit((data) => mutate(data))}
          />
        )}
      />
      <Button onPress={handleSubmit((data) => mutate(data))}>Create</Button>
    </Screen>
  )
}
