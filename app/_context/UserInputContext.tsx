"use client"
import { createContext, Dispatch, SetStateAction } from 'react'

export interface FormValues {
  topic: string;
  description: string;
  level: string;
  chapters: string;
  style: string;
  duration: string;
}

export interface UserInputContextType {
  userInput: FormValues;
  setUserInput: Dispatch<SetStateAction<FormValues>>;
}

export const UserInputContext = createContext<UserInputContextType | null>(null);