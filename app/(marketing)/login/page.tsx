'use client'

import { AuthState, login } from '@/actions/auth'
import { useActionState } from 'react'

const initialState: AuthState = {
  error: null,
};

const page = () => {
  const [state, formAction] = useActionState(login, initialState)
  return (
    <form action={formAction}>
      <h1>Login</h1>

      <input name='email' placeholder='Email' />
      <input name='password' placeholder='Password' />

      {state?.error && <p>{state.error}</p>}

      <button type='submit'>Login</button>
    </form>
  )
}

export default page