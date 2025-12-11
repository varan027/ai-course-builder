import React from 'react'
import Link from 'next/link';
import { Button } from '../../components/ui/button';

const Dashboard = () => {
  return (
    <div className='p-10 flex justify-between items-center'>
      <h1 className='font-semibold text-2xl'>
        Create AI Powered Courses
      </h1>
      <Link href='/dashboard/create-course'>
        <Button>+ Create Course</Button>
      </Link>
    </div>
  )
}

export default Dashboard