"use client"
import type { CourseData } from "@/lib/types"
import { useState } from "react"
import { BiArrowBack } from "react-icons/bi"
import { FaOpenid } from "react-icons/fa6"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"

export interface CourseProps{
  CourseLists: CourseData[]
  loading: boolean;
  Coursedata : CourseData | null;
}

const CoursePreview = ({CourseLists, loading, Coursedata}: CourseProps) => {
  if(loading){
    return (
      <div>
        Generating your Masterpiece.....
      </div>
    )
  }

  if(!Coursedata){
    return (
      <div>
        Fill the Input fields to generate the course
      </div>
    )
  }

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggle = (index : number) =>{
    setActiveIndex(activeIndex == index ? null : index)
  }

  return (
    <div>
      {CourseLists.length == 0 ? (
        <p>No Courses Found</p>
      ) : (
        <div className="space-y-4">
          {CourseLists.map((course)=>(
            <div key={course._id}>
              <div className=" rounded-lg shadow-sm border bg-cardbgclr border-borderclr w-290">
                <div className="bg-uibgclr p-4 space-y-2">
                  <h2 className="font-bold text-2xl">{course.name}</h2>
                  <p className="text-sm text-graytext">{course.description}</p>
                </div>
                <div className="space-y-2 p-3">
                  {course.outline?.Chapters?.map((chapter, index)=>(
                    <div key={index} className="bg-black/40 rounded-lg border border-borderclr ">
                      <div className="flex justify-between items-center p-2">
                        <div>
                          Chapter {index + 1} : <span>{chapter.Chapter_Name}</span>
                        </div>
                        <button className="cursor-pointer bg-uibgclr p-2"
                        onClick={()=>{toggle(index)}}>
                          {activeIndex == index ? <IoIosArrowUp/> : <IoIosArrowDown/>}
                        </button>
                      </div>
                      <div className={`overflow-hidden ${activeIndex==index ? "max-h-25" : "max-h-0"}`} >
                        <div className="font-normal px-2">
                          {chapter.About}
                        </div>
                        <div className="text-sm font-normal text-graytext p-2">
                          {chapter.Duration}
                        </div>
                      </div>
                    </div>
                ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}

export default CoursePreview