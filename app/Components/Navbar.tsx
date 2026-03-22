"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar({ loggedIn }: { loggedIn: boolean }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="font-bold text-xl">SKYPULSE</h1>
      <div className="space-x-4">
        {loggedIn ? (
          <>
            <button
              onClick={handleLogout}
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 font-medium"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/Login" className="hover:underline">
              Login
            </Link>
            <Link href="/Register" className="hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
