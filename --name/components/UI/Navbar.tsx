"use client";

import Link from "next/link";
import { removeToken, isLoggedIn } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const loggedIn = isLoggedIn();

  const logout = () => {
    removeToken();
    router.push("/login");
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-black shadow-lg">
      <h1 className="font-bold text-xl text-green-400">NCC_MSJ</h1>
      <div className="space-x-4">
        {!loggedIn && (
          <>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </>
        )}
        {loggedIn && (
          <>
            <Link href="/dashboard">Dashboard</Link>
            <button onClick={logout} className="bg-red-600 px-3 py-1 rounded">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
