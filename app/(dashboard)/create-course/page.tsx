"use client";
import { createCourse, FormState } from "@/actions/createCourse";
import { useActionState } from "react";
import SubmitButton from "./SubmitButton";
import Link from "next/link";

const initialState: FormState = {};

const page = () => {
  const [state, formAction] = useActionState(createCourse, initialState);
  return (
    <div className="max-w-md mx-auto mt-16 px-4">
      <Link href={"/dashboard"}>
        <button className="mb-10 bg-gray-800 px-3 py-1 rounded-md cursor-pointer">
          Back to dashboard
        </button>
      </Link>
      <h1 className="text-2xl font-semibold mb-2">Create a New Course</h1>

      <p className="text-sm text-gray-500 mb-6">
        Generate a structured path with AI
      </p>

      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="topic" className="block text-sm font-medium mb-1">
            Course Topic
          </label>
          <input
            id="topic"
            name="topic"
            placeholder="Course Topic"
            required
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        <div className="space-y-4">
          <label htmlFor="level" className="block text-sm font-medium mb-1">
            Difficulty Level
          </label>

          <select
            name="level"
            required
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>

          <label htmlFor="level" className="block text-sm font-medium mb-1">
            No of Chapters
          </label>

          <select
            name="chapters"
            required
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="5">5 Chapters</option>
            <option value="8">8 Chapters</option>
            <option value="12">12 Chapters</option>
          </select>

          <label htmlFor="level" className="block text-sm font-medium mb-1">
            Duration
          </label>

          <select
            name="duration"
            required
            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black"
          >
            <option value="30">30 min </option>
            <option value="60">60 min </option>
            <option value="90">90 min </option>
          </select>
        </div>

        {state?.error && <p className="text-xs text-red-600">{state.error}</p>}

        <SubmitButton />
      </form>
    </div>
  );
};

export default page;
