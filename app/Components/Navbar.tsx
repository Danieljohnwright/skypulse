"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Navbar({ loggedIn }: { loggedIn: boolean }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    localStorage.removeItem("token");
    router.push("/");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-2xl">🌤️</span>
        <h1 className="font-bold text-xl text-blue-600 tracking-tight">
          SKYPULSE
        </h1>
      </div>
      <div className="flex items-center gap-3">
        {loggedIn ? (
          <Button
            onClick={handleLogout}
            variant="outline"
            className="text-blue-600 border-blue-600 hover:bg-blue-50"
          >
            Logout
          </Button>
        ) : (
          <>
            <Link href="/Login">
              <Button variant="ghost" className="text-gray-600">
                Login
              </Button>
            </Link>
            <Link href="/Register">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Register
              </Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
