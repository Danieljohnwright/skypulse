import Navbar from "./Components/Navbar";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-sky-400 to-orange-300">
      <Navbar loggedIn={false} />

      {/* Hero */}
      <div className="flex flex-col items-center justify-center h-[80vh] text-center px-4">
        <p className="text-white text-sm font-semibold uppercase tracking-widest mb-3 opacity-80">
          Your Weather. Your Escape.
        </p>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-5 leading-tight drop-shadow-md">
          Chase the Sun <br /> with SkyPulse ☀️
        </h1>
        <p className="text-white text-lg mb-8 max-w-md opacity-90">
          Discover warm, sunny destinations in real time and plan your next
          getaway before the clouds roll in.
        </p>
        <div className="flex gap-4">
          <Link
            href="/Register"
            className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-full hover:bg-blue-50 transition shadow-md"
          >
            Get Started
          </Link>
          <Link
            href="/Login"
            className="border-2 border-white text-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-blue-600 transition"
          >
            Login
          </Link>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-16 px-6">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          <div>
            <div className="text-4xl mb-3">🌍</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Global Coverage
            </h3>
            <p className="text-gray-500 text-sm">
              Search any city in the world and get live weather data instantly.
            </p>
          </div>
          <div>
            <div className="text-4xl mb-3">☀️</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Sunny Recommendations
            </h3>
            <p className="text-gray-500 text-sm">
              We highlight the warmest, clearest destinations so you always know
              where to go.
            </p>
          </div>
          <div>
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Real Time Data
            </h3>
            <p className="text-gray-500 text-sm">
              Powered by live weather APIs so the data is always fresh and
              accurate.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
