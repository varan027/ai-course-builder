"use client"
import type { CourseData } from "@/lib/types"
import { useState } from "react"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"

export interface CourseProps{
  loading: boolean;
  ActiveCourse : CourseData | null;
}

const CoursePreview = ({ loading, ActiveCourse}: CourseProps) => {
  if (!loading) {
    return (
      <div className="animate-pulse">
        <div className="bg-uibgclr/25 w-[70vw] rounded-lg p-8 text-graytext/40 text-xl mb-4 flex">
          <div className="w-1/2">
            <div className="h-8 bg-uibgclr rounded-lg w-5/6 mb-6"></div>
            <div className="h-4 bg-uibgclr rounded-lg w-5/6 mb-4"></div>
            <div className="h-4 bg-uibgclr rounded-lg w-5/6 mb-4"></div>
            <div className="h-4 bg-uibgclr rounded-lg w-4/6"></div>
            <div className="text-sm mt-12">Generating...</div>
          </div>
          <div className="h-52 bg-uibgclr rounded-lg w-1/2"></div>
        </div>
        <div className="bg-uibgclr/25 w-[70vw] rounded-lg p-8 text-graytext/40 text-xl mb-4 space-y-4">
          <div className="bg-uibgclr/50 rounded-lg w-full p-6">
            <div className="h-8 bg-uibgclr rounded-lg w-4/6 mb-6"></div>
            <div className="h-4 bg-uibgclr rounded-lg w-full mb-4"></div>
            <div className="h-4 bg-uibgclr rounded-lg w-full mb-4"></div>
            <div className="h-4 bg-uibgclr rounded-lg w-5/6"></div>
          </div>
          <div className="h-16 bg-uibgclr/50 rounded-lg w-full"></div>
        </div>  
      </div>
    );
  }


  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggle = (index : number) =>{
    setActiveIndex(activeIndex == index ? null : index)
  }

  return (
    <div>
      {!ActiveCourse ? (
        <div>
          <div className="bg-cardbgclr border border-borderclr w-[70vw] p-12 rounded-lg">
          <h1 className="font-mono font-extrabold text-5xl mt-20 text-graytext">GENERATE COURSES <br /> IN ONE CLICK</h1>
        </div>
        </div>
      ) : (
        <div >
            <div key={ActiveCourse._id} className="space-y-4">
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-12 rounded-lg bg-cardbgclr border border-borderclr">
                  <div className="">
                    <h2 className="font-bold text-2xl text-primary">{ActiveCourse.name}</h2>
                    <p className="text-sm text-graytext/80 mt-3">{ActiveCourse.description}</p>
                    <div className="text-xs mt-12 text-graytext">
                      {ActiveCourse.createdAt 
                      ? new Date(ActiveCourse.createdAt).toLocaleDateString('en-US', {
                          day: 'numeric',
                          month: 'short', 
                          year: 'numeric'
                        })
                      : "Date not available"}
                    </div>
                  </div>
                  <div className="bg-uibgclr rounded-lg p-4">
                    <img src="#" alt="" />
                    <div className="text-graytext/60 text-center mt-12">Course Image</div>
                  </div>
                </div>
                <div className="p-6 bg-cardbgclr border border-borderclr rounded-lg space-y-4">
                  {ActiveCourse.outline?.chapters?.map((chapter, index)=>(
                    <div key={index} className="bg-uibgclr rounded-lg border border-borderclr p-4">
                      <div className="flex justify-between items-center">
                        <div className="w-full">
                          Chapter {index + 1} : <span>{chapter.chapterName}</span>
                        </div>
                        <button className="cursor-pointer text-xl"
                        onClick={()=>{toggle(index)}}>
                          {activeIndex == index ? <IoIosArrowUp/> : <IoIosArrowDown/>}
                        </button>
                      </div>
                      <div  className={`overflow-hidden ${activeIndex==index ? "max-h-[500px]" : "max-h-0"}`} >
                        <div className="font-normal text-graytext mt-3 ">
                          {chapter.about}
                        </div>
                        <div className="text-xs text-graytext/70 font-normal mt-3">
                          {chapter.duration}
                        </div>
                      </div>
                    </div>
                ))}
                </div>
              </div>
        </div>
      )}

    </div>
  )
}

export default CoursePreview