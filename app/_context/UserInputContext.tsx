"use client"
import { createContext, Dispatch, SetStateAction } from 'react'
import { FormValues } from '@/lib/types';

export interface UserInputContextType {
  userInput: FormValues;
  setUserInput: Dispatch<SetStateAction<FormValues>>;
}

export const UserInputContext = createContext<UserInputContextType | null>(null);