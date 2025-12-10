import { Button } from "@/components/ui/button";
import Navbar from "./_components/Navbar";
const HomePage = () => {
  return (
    <div className="lg:px-24">
      <Navbar />
      <div className="text-center mt-24">
        <h1 className="font-bold text-6xl">AI COURSE <span className="text-gray-600">BUILDER</span>
        </h1>
        <h1 className="font-semibold text-3xl mt-4">INTELLIGENT LEARNING PATHS, <br /> DESIGNED AROUND YOU</h1>
        <Button className="mt-8 px-8 py-6 text-lg">Get Started</Button>
      </div>
    </div>
  )
}

export default HomePage;