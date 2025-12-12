import React from 'react'
import Logo from './ui/Logo'

const Footer = () => {
  return (
    <footer className='py-6 mb-4 text-center text-xs text-graytext bg-cardbgclr rounded-xl px-6'>
      <Logo />
      <div className='my-2 text-end'>
        Built with ❤️ by <span className='text-primary hover:underline'>varan</span>
        <br />
        &copy; {new Date().getFullYear()} LearnFlow. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer