import { logout } from "@/actions/logout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/auth";
import { courseService } from "@/services/course.service";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, BookOpen, LogOut, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

const page = async () => {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  const courses = await courseService.getAllForUser(user);

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Top Navigation */}
      <header className="border-b border-white/5 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold tracking-tighter text-primary">
              LearnPathAI
            </h1>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
              <Link href="/dashboard" className="text-white">
                My Library
              </Link>
              <Link
                href="/create-course"
                className="hover:text-white transition-colors"
              >
                Generator
              </Link>
            </nav>
          </div>
          <form action={logout}>
            <button className="flex items-center gap-2 text-sm text-muted-foreground hover:text-destructive transition-colors px-3 py-2 rounded-lg hover:bg-destructive/5">
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-4xl font-bold tracking-tight mb-2">
              My Library
            </h2>
            <p className="text-muted-foreground">
              Welcome back,{" "}
              <span className="text-white font-medium">
                {user.email.split("@")[0]}
              </span>
              . Ready to learn?
            </p>
          </div>
          <Link href="/create-course">
            <Button className="h-12 px-6 rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
              <Plus className="w-5 h-5 mr-2" /> New Course
            </Button>
          </Link>
        </div>

        {/* Course Grid */}
        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-white/5 rounded-3xl bg-white/2">
            <div className="p-4 bg-primary/10 rounded-full mb-4">
              <BookOpen className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-1">
              Your library is empty
            </h3>
            <p className="text-muted-foreground mb-6">
              Start by generating your first AI-powered course.
            </p>
            <Link href="/create-course">
              <Button variant="outline" className="rounded-xl">
                Create Course
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                href={`/courses/${course.id}`}
                key={course.id}
                className="group"
              >
                <Card className="h-full bg-white/3 border-white/5 hover:border-primary/50 hover:bg-white/5 transition-all duration-300 rounded-2xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                      <Plus className="w-4 h-4 text-primary" />
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <div className="text-[10px] uppercase tracking-widest text-primary font-bold mb-1">
                      {course.level}
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {course.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {/* Note: In your actual app, you might want to show total chapters here */}
                      {(course.outline as any).chapters?.length || 0} Modules •
                      Structured Learning
                    </p>
                    <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                      <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                        <div className="bg-primary h-full w-[10%]" />{" "}
                        {/* Static placeholder, you can map real progress here */}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default page;
