'use client'
import { createContext } from "react";
import { Goal } from "@/services/goal.service";

export const GoalContext = createContext<Goal | null>(null);