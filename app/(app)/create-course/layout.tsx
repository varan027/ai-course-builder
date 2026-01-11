"use client"
import { useState } from 'react'
import { UserInputContext } from '@/app/_context/UserInputContext'
import { FormValues } from "@/lib/types"

const layout = ({children} : {children: React.ReactNode}) => {

  const [userInput, setUserInput] = useState<FormValues>({} as FormValues);

  return (
    <div>
      <UserInputContext.Provider value={{userInput, setUserInput}}>
        <>  
          {children}
        </>
      </UserInputContext.Provider>
    </div>
  )
}

export default layout