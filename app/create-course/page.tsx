import { getCourseData } from "@/lib/data";
import Wrapper from "./_components/Wrapper";

const CourseCreatePage = async () => {
  const courses = await getCourseData();


  return (
    <main className="lg:p-4 p-2 mt-16 md:px-24">
      <Wrapper CourseLists={courses} />
    </main>
  );
};

export default CourseCreatePage;
