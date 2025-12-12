// app/page.tsx
"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/NavBar";
import CourseForm from "../../components/CourseForm";
import CoursePreview from "../../components/CoursePreview";
import { Course } from "../../lib/types";

export default function HomePage() {
  // start with stable value on first render (server-safe)
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

const handleGenerate = () => {

}
  

  return (
    <div className="">
      <Navbar />
      <main className="lg:p-4 p-4 mt-16 md:px-24">
        <div className="lg:flex lg:space-x-4 space-y-4 max-w-">
          <div className="lg:w-80 lg">
            <CourseForm onGenerate={handleGenerate} />
          </div>

          <div className="lg:flex-1">
            {loading ? (
              <div className="bg-cardbgclr p-6 rounded shadow">Generating…</div>
            ) : (
              <CoursePreview/>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
