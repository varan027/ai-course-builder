'use client'
import { createContext } from "react";
import { Goal } from "@/services/goal.service";

export const CourseContext = createContext<Goal | null>(null);