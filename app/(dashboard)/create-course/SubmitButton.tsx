'use client'
import { useFormStatus } from 'react-dom'

const SubmitButton = () => {
  const { pending } = useFormStatus();
  return (
    <button type='submit' disabled={pending} className='border px-3 py-1 rounded-md cursor-pointer'>
      {pending ? "Creating...." : "Create"}
    </button>
  )
}

export default SubmitButton;