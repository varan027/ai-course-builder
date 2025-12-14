"use client"
import { createContext, Dispatch, SetStateAction } from 'react'
interface UserInputContextType {
  userInput: string[];
  setUserInput: Dispatch<SetStateAction<string[]>>;
}

export const UserInputContext = createContext<UserInputContextType | null>(null);