import { Modal } from '~/components/ui/modal'
import { removeFeedbackPage } from '~/features/feedback/actions.client'
import { FormGiveFeedback } from '~/features/feedback/components/form-give-feedback'

export default function GiveFeedbackModal() {
  return (
    <Modal
      path='/give-feedback'
      title='Give Feedback'
      description="Let us know how we're doing, so we can improve your experience."
      onClose={removeFeedbackPage}>
      <FormGiveFeedback />
    </Modal>
  )
}
