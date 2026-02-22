"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type CourseWithMeta = {
  id: string;
  title: string;
  level: string;
  outline: any;
  totalModules: number;
  progressPercent: number;
};

export default function CourseGrid({ courses }: { courses: CourseWithMeta[] }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.05 } },
      }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 auto-rows-fr"
    >
      {courses.map((course) => (
        <motion.div
          key={course.id}
          variants={{
            hidden: { opacity: 0, y: 10 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.3 }}
        >
          <Link href={`/courses/${course.id}`} className="group">
            <Card className="relative h-full flex flex-col bg-[#121212] border border-white/10 hover:border-white/20 transition-all duration-300 rounded-2xl p-8 hover:scale-[1.01] hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)]">
              {/* Top Accent Line */}
              <div className="absolute top-0 left-0 h-0.5 w-full bg-linear-to-r from-primary/0 via-primary/40 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <CardHeader className="p-0 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground">
                    {course.level}
                  </span>

                  {course.progressPercent === 100 && (
                    <span className="text-[10px] text-primary font-medium">
                      Completed
                    </span>
                  )}
                </div>

                <CardTitle className="text-xl font-semibold tracking-tight leading-snug min-h-14 line-clamp-2">
                  {course.title}
                </CardTitle>
              </CardHeader>

              {/* This pushes bottom content down */}
              <div className="flex-1" />

              <CardContent className="p-0 space-y-5">
                <p className="text-sm text-muted-foreground">
                  {course.totalModules} Modules
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Completion</span>
                    <span className="text-white">
                      {course.progressPercent}%
                    </span>
                  </div>

                  <div className="w-full h-2.5 bg-[#181818] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all duration-700 ease-out group-hover:bg-primary/90"
                      style={{ width: `${course.progressPercent}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}
