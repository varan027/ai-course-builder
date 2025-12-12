import React from 'react'
import Card from './ui/Card'

const Features = () => {
  return (
    <div>
      <h1 className='font-mono text-xl font-semibold'>Features</h1>
      <div className='flex flex-wrap gap-2 mt-4'>
        <Card className='w-full md:w-1/2 lg:w-1/3'>
          <h2 className='mb-2'>Personalized Learning Paths</h2>
          <p className='text-sm text-graytext'>AI-generated courses tailored to your goals, learning style, and pace.</p>
        </Card>
        <Card className='w-full md:w-1/2 lg:w-1/3'>
          <h2 className='mb-2'>Step-by-Step Guidance</h2>
          <p className='text-sm text-graytext'>Clear, structured roadmaps to help you master any skill efficiently.</p> 
        </Card>
        <Card className='w-full md:w-1/2 lg:w-1/3'>
          <h2 className='mb-2'>Adaptive Learning</h2>
          <p className='text-sm text-graytext'>Courses that evolve based on your progress and feedback.</p>

        </Card>
        <Card className='w-full md:w-1/2 lg:w-1/3'>
          <h2 className='mb-2'>Diverse Learning Styles</h2>
          <p className='text-sm text-graytext'>Content designed to suit visual, auditory, and kinesthetic learners.</p>
        </Card>
        <Card className='w-full md:w-1/2 lg:w-1/3'>
          <h2 className='mb-2'>Progress Tracking</h2>
          <p className='text-sm text-graytext'>Monitor your learning journey with built-in progress indicators.</p>
        </Card>
        <Card className='w-full md:w-1/2 lg:w-1/3'>
          <h2 className='mb-2'>Resource Recommendations</h2>
          <p className='text-sm text-graytext'>Curated articles, videos, and exercises to enhance your understanding.</p>
        </Card>
      </div>
    </div>
  )
}

export default Features