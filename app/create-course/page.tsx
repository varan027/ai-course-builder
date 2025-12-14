// app/page.tsx
"use client";
import { useContext, useEffect } from "react";
import Navbar from "../../components/NavBar";
import { UserInputContext } from "../_context/UserInputContext";
import CourseForm from "./_components/CourseForm";

export default function HomePage() {

const handleGenerate = () => {

}
const context = useContext(UserInputContext);
if (!context) {
  throw new Error("UserInputContext is not available");
}
const {userInput, setUserInput} = context;

useEffect(()=>{
  console.log("User Input Updated:", userInput);
},[userInput])

  return (
    <div className="">
      <main className="lg:p-4 p-4 mt-16 md:px-24">
        <div className="lg:flex lg:space-x-4 space-y-4 max-w-">
          <div className="lg:w-80 lg">
            <CourseForm/>
          </div>
        </div>
      </main>
    </div>
  );
}
