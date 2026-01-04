"use client"

import { signIn, signOut, useSession } from 'next-auth/react'

const Login = () => {
  const {data: session, status} = useSession();

  if(status === "loading"){
    return <div className='text-primary'>loading..</div>
  }

  if(!session){
    return (
      <button onClick={() => signIn("google")}
      className='bg-primary text-black p-2 px-4 rounded-lg border ml-2 hover:bg-primary/50 cursor-pointer'>
        Sign in with Google
      </button>
    )
  }

  return (
    <div>
      <span>{session.user.email}</span>
      <button onClick={() => signOut()}>
        Logout
      </button>
    </div>
  )
}

export default Login;