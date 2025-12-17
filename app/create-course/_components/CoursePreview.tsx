"use client"
import type { Course } from "@/lib/types"
import { useState } from "react"
import { IoIosArrowDown } from "react-icons/io"

interface CourseProps{
  CourseLists: Course[]
}

const CoursePreview = ({CourseLists}: CourseProps) => {

  const [chapterOpen, setChapterOpen] = useState(false);

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
                <div className="space-y-2 p-4">
                  {course.outline?.Chapters?.map((chapter, index)=>(
                    <div key={index} className="bg-black/40 rounded-lg border border-borderclr p-2 px-4 space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          Chapter {index + 1} : <span>{chapter.Chapter_Name}</span>
                        </div>
                        <button className="bg-uibgclr cursor-pointer" key={index} onClick={()=> setChapterOpen(prev => !prev)}>
                          <IoIosArrowDown/>
                        </button>
                      </div>
                      {chapterOpen  ?  (
                        <div>
                          <div className="font-normal">
                            {chapter.About}
                          </div>
                          <div className="text-xs font-normal text-graytext">
                            {chapter.Duration}
                          </div>
                        </div>
                      ) : null}
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