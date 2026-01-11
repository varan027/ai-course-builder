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
      <div className="flex :flex-row space-y-4 flex-col lg:items-start items-center pt-20">
        <div className="lg:fixed lg:max-w-1/4 lg:h-[80vh]">
          <CourseForm setCourseData={setActiveCourse} setLoading={setLoading} />
        </div>
        <div className="lg:ml-[26%]">
          <CoursePreview loading={loading} activeCourse={activeCourse} />
        </div>
      </div>
    </div>
  )
}

export default Wrapper