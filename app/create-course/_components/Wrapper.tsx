"use client"
import CourseForm from './CourseForm';
import CoursePreview from './CoursePreview';
import { useState } from 'react';
import { CourseData } from '@/lib/types';


const Wrapper = () => {
  const [activeCourse, setActiveCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
      
  return (
    <div>
      <div className="flex lg:space-x-4 lg:flex-row space-y-4 flex-col lg:items-start items-center">
        <div className="lg:fixed lg:max-w-1/4 lg:h-[80vh]">
          <CourseForm setCourseData={setActiveCourse} setLoading={setLoading} />
        </div>
        <div className="lg:ml-[27%]">
          <CoursePreview loading={loading} ActiveCourse={activeCourse} />
        </div>
      </div>
    </div>
  )
}

export default Wrapper