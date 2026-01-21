'use client'
import { createContext } from "react";
import { Course } from "@/services/course.service";

export const CourseContext = createContext<Course | null>(null);
