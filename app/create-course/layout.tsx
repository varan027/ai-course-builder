"use client"
import NavBar from '@/components/NavBar'
import { useState } from 'react'
import { UserInputContext } from '../_context/UserInputContext'
import {FormValues, UserInputContextType} from "@/app/_context/UserInputContext"

const layout = ({children} : {children: React.ReactNode}) => {

  const [userInput, setUserInput] = useState();

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