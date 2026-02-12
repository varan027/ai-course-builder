import { logout } from "@/actions/logout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { courseService } from "@/services/course.service";
import Link from "next/link";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  const courses = await courseService.getAllForUser(user);

  return (
    <div className="max-w-6xl mx-auto px-8 py-20 space-y-16">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <h1 className="text-2xl font-semibold">Courses</h1>
          <p className="text-sm text-gray-400 mt-1">
            AI Generated learning paths
          </p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="text-sm text-gray-400 hover:text-red-700 cursor-pointer border px-3 py-1 rounded-md"
          >
            Logout
          </button>
        </form>
      </div>

      <div className="flex justify-between mb-10">
        <h1 className="text-xl font-medium">
          Hi, <span>{user.email}</span>
        </h1>
        <Link href={"/create-course"}>
          <button className="text-black bg-white py-2 rounded-md text-sm px-3 cursor-pointer">
            Create Course
          </button>
        </Link>
      </div>

      {/* Empty state */}
      {courses.length === 0 && (
        <div className="border rounded-lg p-8 text-center">
          <p className="text-gray-300 mb-4">You haven't created any Courses</p>
          <p className="text-sm text-gray-500">
            Create your first AI-Powered Learning path to get started
          </p>
        </div>
      )}

      {/* Courses */}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((course) => (
          <Link href={`/courses/${course.id}`} key={course.id}>
            <Card className="hover:shadow-lg hover:shadow-primary/10 transition-all duration-300">
              <CardHeader>
                <CardTitle>{course.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{course.level}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default page;
