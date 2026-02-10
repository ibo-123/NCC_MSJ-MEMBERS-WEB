"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { isLoggedIn } from "@/lib/auth";

export default function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    // This runs only on the client side
    setLoggedIn(isLoggedIn());
  }, []);

  return (
    <nav>
      {/* Your navbar code */}
      {loggedIn ? (
        <Link href="/dashboard">Dashboard</Link>
      ) : (
        <Link href="/login">Login</Link>
      )}
    </nav>
  );
}
