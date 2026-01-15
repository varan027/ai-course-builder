import { logout } from "@/actions/logout";
import { getCurrentUser } from "@/lib/auth";
import { Modules } from "@/services/ai.service";
import { courseService } from "@/services/course.service";
import { redirect } from "next/navigation";

const page = async () => {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  const courses = await courseService.getAllForUser(user);
  return (
    <div className="p-24">
      <form action={logout}>
        <button type="submit">Logout</button>
      </form>
      <h1>Dashboard</h1>
      {courses.length == 0 ? (
        <p>No Courses yet</p>
      ) : (
        <ul>
          {courses.map((course) => (
            <li key={course.id}>
              <h1 className="text-red-500"> {course.title} </h1>

              <ul>
                {course.outline.modules.map((m: Modules) => (
                  <li key={m.name}>
                    <strong className="text-amber-300">{m.name}</strong>
                    <ul>
                      {m.lessons.map((l) => (
                        <li key={l.title}>
                          {l.title}{" "}
                          <a
                            href={`https://www.youtube.com/results?search_query=${encodeURIComponent(
                              l.youtubeQuery
                            )}`}
                            target="blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 ml-10"
                          >
                            Search on Youtube
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default page;
