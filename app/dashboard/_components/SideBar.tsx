"use client"
import { RxDashboard } from "react-icons/rx";
import { FaDiscourse } from "react-icons/fa";
import { IoIosSettings } from "react-icons/io";
import { usePathname } from 'next/navigation';
import Link from "next/link";

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
    }
  ]
  const pathName = usePathname();
  return (
    <div className='fixed md:w-64 shadow h-full rounded-2xl p-4'>
      <h1 className='font-pressstart text-lg text-center p-4'>AI.Course</h1>
        <ul>
        {menuList.map((menu) => (
          <Link href={menu.path} key={menu.id}>
          <li className={`flex items-center gap-2 p-2 rounded hover:shadow-inner text-gray-700 hover:text-black hover:bg-gray-200 cursor-pointer mt-4 ${pathName === menu.path && 'bg-gray-200'}`}>
            <span>{menu.icon}</span>
            <span>{menu.name}</span>
          </li>
          </Link>
        ))}
      </ul>
      
    </div>
  )
}

export default SideBar