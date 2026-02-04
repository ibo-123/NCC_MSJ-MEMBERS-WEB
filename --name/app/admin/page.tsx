"use client";

import Link from "next/link";
import ProtectedRoute from "@/components/UI/protectedRoutes";

export default function AdminPanel() {
  return (
    // <ProtectedRoute>
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/admin/users" className="card">
          👥 Manage Users
        </Link>
        <Link href="/admin/courses" className="card">
          📚 Manage Courses
        </Link>
        <Link href="/admin/attendance" className="card">
          📝 Attendance
        </Link>
        <Link href="/admin/achievements" className="card">
          🏆 Achievements
        </Link>
      </div>
    </div>
    /* </ProtectedRoute> */
  );
}
