import { getServerSession } from "next-auth";
import Wrapper from "./_components/Wrapper";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";


const CourseCreatePage = async () => {
  const session = await getServerSession(authOptions);

  if(!session?.user){
    redirect("/");
  }

  return (
    <main className="lg:p-4 p-2 mt-18 ">
      <Wrapper />
    </main>
  );
};

export default CourseCreatePage;
