'use client'
import { createCourse, FormState } from '@/actions/createCourse'
import { useActionState } from 'react';
import SubmitButton from './SubmitButton';

const initialState: FormState = {};

const page = () => {
  const [state, formAction] = useActionState(createCourse, initialState)
  return (
    <form action={formAction} >
      <h1>Create Course</h1>

      <input
      name='topic'
      placeholder='Course Topic'
      required
      />

      <select name='level' required>
        <option value="beginner">Beginner</option>
        <option value="intermediate">Intermediate</option>
        <option value="advanced">Advanced</option>
      </select>

      {state?.error && (
        <p style={{ color: "red" }}>{state.error}</p>
      )}

      <SubmitButton/>
    </form>
  )
}

export default page