import Navbar from "./Components/Navbar";
import Link from "next/link";
import Dashboard from "./Dashboard/page";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 via-purple-400 to-orange-400">
      <Navbar loggedIn={false} />
      <div className="flex flex-col items-center justify-center h-[80vh] text-center">
        <h1 className="text-4xl font-bold mb-4">Find Your Sunny Escape</h1>
        <p className="mb-6">Jump to the next sunny city before it gets cold!</p>
        <Link
          href="/Login"
          className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
}
