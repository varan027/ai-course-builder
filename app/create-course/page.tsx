import CourseForm from "./_components/CourseForm";
import { getCourseData } from "@/lib/data";
import CoursePreview from "./_components/CoursePreview";

const CourseCreatePage = async () => {
  const courses = await getCourseData();

  return (
    <main className="lg:p-4 p-2 mt-16 md:px-24">
      <div className="flex lg:space-x-4 lg:flex-row space-y-4 flex-col lg:items-start items-center">
        <div className="w-72">
          <CourseForm />
        </div>
        <div className="h-full">
          <CoursePreview CourseLists={courses}/>
        </div>
      </div>
    </main>
  );
};

export default CourseCreatePage;
