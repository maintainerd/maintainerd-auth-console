import { Button } from '@/components/ui/button'
import { Field } from '@/components/ui/field'
import { Loader2 } from 'lucide-react'

interface FormSubmitButtonProps {
  isSubmitting: boolean
  submitText: string
  submittingText?: string
  disabled?: boolean
  className?: string
}

export default function FormSubmitButton({
  isSubmitting,
  submitText,
  submittingText,
  disabled = false,
  className
}: FormSubmitButtonProps) {
  const defaultSubmittingText = `${submitText.replace(/^(Create|Update|Add|Save|Delete)/, '$1ing')}...`
  const displaySubmittingText = submittingText || defaultSubmittingText

  return (
    <Field>
      <Button 
        type="submit" 
        disabled={isSubmitting || disabled}
        className={className}
      >
        {isSubmitting && <Loader2 className="animate-spin" />}
        {isSubmitting ? displaySubmittingText : submitText}
      </Button>
    </Field>
  )
}
