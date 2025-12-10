import { ReactNode } from 'react'
import SideBar from './_components/SideBar'

const DashboardLayout = ({children}: {children: ReactNode}) => {
  return (
    <div>
      <div className='hidden md:block md:w-64 '>
        <SideBar />
      </div>
      <div className='ml-64'>
        {children}
      </div>
    </div>
  )
}

export default DashboardLayout