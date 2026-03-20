import Link from "next/link";

export default function Navbar({ loggedIn }: { loggedIn: boolean }) {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="font-bold text-xl"> SKYPULSE</h1>
      <div className="space-x-4">
        {loggedIn ? (
          <Link href="/Dashboard" className="hover:underline">
            Dashboard
          </Link>
        ) : (
          <>
            <Link href="Login" className="hover:underline">
              Login
            </Link>
            <Link href="Register" className="hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
