import { logout } from "@/actions/logout";
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
    <div className="max-w-5xl mx-auto px-6 py-16">
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

      <div className="space-y-10">
        {courses.map((course) => (
          <div key={course.id} className="border rounded-lg p-6">
            <h2 className="text-xl font-medium mb-4 text-red-500">
              {" "}
              {course.title}{" "}
            </h2>

            {course.outline && (
              <div className="space-y-6">
                {course.outline.chapters.map((chapter) => (
                  <div key={chapter.title}>
                    <h3 className="text-amber-300 font-semibold mb-2">
                      {chapter.title}
                    </h3>
                    <p className="text-sm">{chapter.about}</p>

                    <ul className="ml-4 space-y-2">
                      <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                          chapter.youtubeQuery
                        )}`}
                        target="blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 text-xs hover:underline ml-10"
                      >
                        Search on Youtube
                      </a>
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default page;
