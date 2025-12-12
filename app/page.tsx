import Features from '@/components/Features'
import Footer from '@/components/Footer'
import NavBar from '@/components/NavBar'
import Button from '@/components/ui/Button'
import React from 'react'

const page = () => {
  return (
    <div className='px-4 space-y-6 lg:px-24'>
      <NavBar />
      <div className='lg:py-20 mt-20 md:text-center lg:px-0 max-w-3xl mx-auto lg:space-y-6 space-y-4'>
        <h1 className='lg:text-6xl md:text-4xl text-2xl'>Master Any Skill With an<br /><span className='text-primary'>AI-Powered</span> Learning Path</h1>
        <p className='text-xs lg:text-sm text-graytext'>LearnFlow creates personalized, step-by-step courses tailored to your goals, learning style, and pace. <br /> Stop searching endlessly — get a smart roadmap that adapts to you.</p>
        <Button className="font-medium bg-primary/10 border border-primary/60 text-primary hover:bg-primary hover:text-black">Get Started</Button>
        <p className='text-xs text-graytext'>Your unique learning journey starts with one click. <br />
          Powered by AI. Designed for humans.</p>
      </div>
      <hr className='border-borderclr' />
      <Features />
      <hr className='border-borderclr' />
      <Footer />
    </div>
  )
}

export default page