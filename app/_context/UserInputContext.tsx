"use client"
import { createContext, Dispatch, SetStateAction } from 'react'

interface FormValues {
  topic: string;
  desc: string;
  level: string;
  chapters: string;
  style: string;
  duration: string;
}

interface UserInputContextType {
  userInput: FormValues;
  setUserInput: Dispatch<SetStateAction<string[]>>;
}

export const UserInputContext = createContext<UserInputContextType | null>(null);