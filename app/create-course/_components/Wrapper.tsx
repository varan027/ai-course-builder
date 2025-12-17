"use client"
import CourseForm from './CourseForm';
import CoursePreview from './CoursePreview';
import { CourseProps } from './CoursePreview';
import { useState } from 'react';
import { CourseData } from '@/lib/types';

const Wrapper = ({CourseLists}: CourseProps) => {
  const [CourseData, setCourseData] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
      
  return (
    <div>
      <div className="flex lg:space-x-4 lg:flex-row space-y-4 flex-col lg:items-start items-center">
        <div className="w-72">
          <CourseForm setCourseData={setCourseData} setLoading={setLoading} />
        </div>
        <div className="h-full">
          <CoursePreview CourseLists={CourseLists} loading={loading} Coursedata={CourseData} />
        </div>
      </div>
    </div>
  )
}

export default Wrapper