// app/dashboard/page.jsx
"use client";

import { useState, useEffect } from "react";
import API from "@/lib/api";
import Link from "next/link";
import ProtectedRoute from "@/components/UI/protectedRoutes";

export default function UserDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await API.get("/dashboard/user");
      setDashboardData(response.data.data);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
          <p className="mt-4 text-green-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const { user, stats, recentActivity, quickLinks } = dashboardData || {};

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  Welcome back, {user?.name}!
                </h1>
                <p className="text-gray-400">
                  {user?.rank} Member • {user?.department} • Year {user?.year}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <Link
                  href="/profile"
                  className="px-6 py-3 bg-gradient-to-r from-green-700 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-500"
                >
                  View Profile
                </Link>
              </div>
            </div>
            <div className="h-1 w-24 bg-gradient-to-r from-green-600 to-emerald-400 mt-4 rounded-full" />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-900/70 border border-green-900/30 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Attendance Rate</p>
                  <h3 className="text-3xl font-bold text-white">
                    {stats?.attendance?.overallRate?.toFixed(1)}%
                  </h3>
                  <p className="text-xs text-green-400 mt-2">
                    {stats?.attendance?.totalHours} hours total
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-green-900/30 to-emerald-800/30 rounded-xl flex items-center justify-center border border-green-700/30">
                  <svg
                    className="w-6 h-6 text-green-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/70 border border-green-900/30 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Achievements</p>
                  <h3 className="text-3xl font-bold text-white">
                    {stats?.achievements?.total || 0}
                  </h3>
                  <p className="text-xs text-green-400 mt-2">
                    {stats?.achievements?.points || 0} points
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 rounded-xl flex items-center justify-center border border-yellow-700/30">
                  <svg
                    className="w-6 h-6 text-yellow-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/70 border border-green-900/30 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Courses</p>
                  <h3 className="text-3xl font-bold text-white">
                    {stats?.courses?.enrolled || 0}
                  </h3>
                  <p className="text-xs text-green-400 mt-2">
                    {stats?.courses?.completed || 0} completed
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-900/30 to-blue-800/30 rounded-xl flex items-center justify-center border border-blue-700/30">
                  <svg
                    className="w-6 h-6 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-gray-900/70 border border-green-900/30 rounded-2xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Events</p>
                  <h3 className="text-3xl font-bold text-white">
                    {stats?.events?.upcoming || 0}
                  </h3>
                  <p className="text-xs text-green-400 mt-2">
                    {stats?.events?.attended || 0} attended
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-900/30 to-purple-800/30 rounded-xl flex items-center justify-center border border-purple-700/30">
                  <svg
                    className="w-6 h-6 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Recent Attendance */}
            <div className="bg-gray-900/70 border border-green-900/30 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Recent Attendance
              </h2>
              <div className="space-y-4">
                {recentActivity?.attendance?.map((record, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className={`w-2 h-2 rounded-full mr-3 ${
                          record.status === "Present"
                            ? "bg-green-500"
                            : record.status === "Late"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                      <div>
                        <p className="text-white">{record.eventName}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(record.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        record.status === "Present"
                          ? "bg-green-500/20 text-green-400"
                          : record.status === "Late"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {record.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Achievements */}
            <div className="bg-gray-900/70 border border-green-900/30 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Recent Achievements
              </h2>
              <div className="space-y-4">
                {recentActivity?.achievements?.map((achievement, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-900/30 to-yellow-800/30 rounded-lg flex items-center justify-center mr-3 border border-yellow-700/30">
                        <span className="text-yellow-400">🏆</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          {achievement.title}
                        </p>
                        <p className="text-xs text-gray-400">
                          {achievement.level} • {achievement.category}
                        </p>
                      </div>
                    </div>
                    <span className="text-xs text-green-400">
                      {new Date(achievement.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* My Courses */}
            <div className="bg-gray-900/70 border border-green-900/30 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">My Courses</h2>
              <div className="space-y-3">
                {quickLinks?.courses?.map((course) => (
                  <Link
                    key={course._id}
                    href={`/courses/${course._id}`}
                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-all"
                  >
                    <div>
                      <p className="text-white font-medium">{course.title}</p>
                      <p className="text-xs text-gray-400">{course.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 text-sm">Continue →</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-gray-900/70 border border-green-900/30 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Upcoming Events
              </h2>
              <div className="space-y-3">
                {quickLinks?.events?.map((event) => (
                  <Link
                    key={event._id}
                    href={`/events/${event._id}`}
                    className="flex items-center justify-between p-3 bg-gray-800/50 rounded-xl hover:bg-gray-800 transition-all"
                  >
                    <div>
                      <p className="text-white font-medium">{event.title}</p>
                      <p className="text-xs text-gray-400">{event.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-green-400 text-sm">
                        {new Date(event.startDate).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
