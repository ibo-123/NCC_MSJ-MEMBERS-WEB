import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-5xl font-bold text-green-400 mb-4">
        NCC_MSJ Tech Platform
      </h1>
      <p className="text-gray-400 mb-6 max-w-xl">
        A professional system for managing members, attendance, achievements,
        and courses — powered by modern web technologies.
      </p>
      <div className="space-x-4">
        <Link
          href="/login"
          className="bg-green-600 px-6 py-3 rounded hover:bg-green-700"
        >
          Login
        </Link>
        <Link
          href="/register"
          className="border border-green-600 px-6 py-3 rounded hover:bg-green-600"
        >
          Register
        </Link>
      </div>
    </div>
  );
}
