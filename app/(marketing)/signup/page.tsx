'use client'

import { AuthState, Signup } from '@/actions/auth'
import { useActionState } from 'react'

const initialState: AuthState = {
  error: null,
};

const page = () => {
  const [state, formAction] = useActionState(Signup, initialState)
  return (
    <form action={formAction}>
      <h1>Signup</h1>

      <input name='email' placeholder='Email' />
      <input name='password' placeholder='Password' />

      {state?.error && <p>{state.error}</p>}

      <button type='submit'>Signup</button>
    </form>
  )
}

export default page