"use client"
import NavBar from '@/components/NavBar'
import { useState } from 'react'
import { UserInputContext } from '../_context/UserInputContext'
import { FormValues } from "@/lib/types"

const layout = ({children} : {children: React.ReactNode}) => {

  const [userInput, setUserInput] = useState<FormValues>({} as FormValues);

  return (
    <div>
      <UserInputContext.Provider value={{userInput, setUserInput}}>
        <>  
          <NavBar />
          {children}
        </>
      </UserInputContext.Provider>
    </div>
  )
}

export default layout