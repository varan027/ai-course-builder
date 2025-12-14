import React from "react";
import Card from "./ui/Card";

const Features = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center px-42 py-4">
      <h1 className="font-mono text-xl font-semibold">Features</h1>
      <div className="grid grid-cols-6 gap-3 grid-rows-6 mt-6 w-full h-full">
        <Card className="col-span-4 row-span-2">
          <h2 className="mb-2">Personalized Learning Paths</h2>
          <p className="text-xs text-graytext">
            AI-generated courses tailored to your goals, learning style, and
            pace.
          </p>
        </Card>
        <Card className=" col-span-2 row-span-3">
          <h2 className="mb-2">Step-by-Step Guidance</h2>
          <p className="text-xs text-graytext">
            Clear, structured roadmaps to help you master any skill efficiently.
          </p>
        </Card>
        <Card className=" col-span-2 row-span-2">
          <h2 className="mb-2">Adaptive Learning</h2>
          <p className="text-xs text-graytext">
            Courses that evolve based on your progress and feedback.
          </p>
        </Card>
        <Card className="col-span-2 row-span-2">
          <h2 className="mb-2">Diverse Learning Styles</h2>
          <p className="text-xs text-graytext">
            Content designed to suit visual, auditory, and kinesthetic learners.
          </p>
        </Card>
        <Card className="col-span-2 row-span-3">
          <h2 className="mb-2">Progress Tracking</h2>
          <p className="text-xs text-graytext">
            Monitor your learning journey with built-in progress indicators.
          </p>
        </Card>
        <Card className="col-span-4 row-span-2">
          <h2 className="mb-2">Resource Recommendations</h2>
          <p className="text-xs text-graytext">
            Curated articles, videos, and exercises to enhance your
            understanding.
          </p>
        </Card>
      </div>
    </div>
  );
};

export default Features;
