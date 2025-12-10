import { Button } from '@/components/ui/button'
import Link from 'next/link'

const Navbar = () => {
  return (
    <div className='flex items-center justify-between p-4 md:p-8'>
      <h1 className='md:text-xl font-pressstart'>AI.Course</h1>
      <Link href="/dashboard">
        <Button className='cursor-pointer'>Get Started</Button> 
      </Link>
    </div>
  )
}

export default Navbar