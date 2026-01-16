import React from 'react'

const layout = ({ children } : { children : React.ReactNode }) => {
  return (
    <div className='flex'>
      <aside className='w-[200] bg-amber-900'>
        Sidebar 
      </aside>
      <main className='flex-1'>
        {children}
      </main>
    </div>
  )
}

export default layout