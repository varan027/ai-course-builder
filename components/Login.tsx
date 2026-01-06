"use client"

import { signIn, signOut, useSession } from 'next-auth/react'
import Button from './ui/Button';

const Login = () => {
  const {data: session, status} = useSession();

  // if(status === "loading"){
  //   return <div className='text-primary'>loading..</div>
  // }

  if(!session){
    return (
      <Button onClick={() => signIn("google")}
      className='hidden md:inline-flex border-2 border-primary/40 bg-primary/5 hover:bg-primary/20 text-primary text-sm font-semibold'>
        Sign in with Google
      </Button>
    )
  }

  return (
    <div className='space-x-2'>
      <span>{session.user.email}</span>
      <Button className='text-red-500 text-sm font-semibold border-2 border-red-500 bg-red-500/5 hover:bg-red-500/20' onClick={() => signOut()}>
        Logout
      </Button>
    </div>
  )
}

export default Login;