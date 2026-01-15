'use client'
import { useFormStatus } from 'react-dom'

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button type='submit' disabled={pending}>
      {pending ? "Creating...." : "Create"}
    </button>
  )
}

export default SubmitButton;