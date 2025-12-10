import path from 'path'
import React from 'react'
import { RxDashboard } from "react-icons/rx";
import { FaDiscourse } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";

const SideBar = () => {
  const menuList = [
    { 
      id: 1,
      name: 'Dashboard',
      icon: <RxDashboard />,
      path: '/dashboard'
    },

    { 
      id: 2,
      name: 'My Courses',
      icon: <FaDiscourse />,
      path: '/dashboard/courses'
    },

    { 
      id: 3,
      name: 'Settings',
      icon: <IoIosSettings />,
      path: '/dashboard/settings'
    },
  ]
  return (
    <div className='fixed md:w-64 shadow h-full rounded-2xl p-4'>
      <h1 className='font-pressstart text-lg text-center p-4'>AI.Course</h1>
      <ul>
        {menuList.map((menu) => (
          <li key={menu.id} className='flex items-center gap-2 p-2 rounded hover:shadow-inner hover:shadow-gray-600 hover:bg-black hover:text-white cursor-pointer mt-4'>
            <span>{menu.icon}</span>
            <span>{menu.name}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default SideBar