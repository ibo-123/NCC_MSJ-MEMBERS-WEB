"use client";

import { useState, useEffect } from "react";
import API from "@/lib/api";
import ProtectedRoute from "@/components/UI/protectedRoutes";

// Define types for better safety
interface User {
  name: string;
  studentId: string;
  department: string;
  year: string;
  role: string;
}

interface DashboardData {
  user: User;
  attendancePercentage: number;
  attendedEvents: number;
  totalEvents: number;
  achievements: any[];
  recentEvents: any[];
  upcomingEvents: any[];
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await API.get("/dashboard/user");

      // Log the response to see its structure
      console.log("Dashboard API Response:", res.data);

      setData(res.data.data);
      setError("");
    } catch (err: any) {
      console.error("Error fetching dashboard:", err);
      setError(err.response?.data?.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
            <p className="mt-4 text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !data) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <div className="text-center max-w-md p-8 bg-gray-900/70 border border-green-900/30 rounded-2xl">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <p className="text-gray-400 text-lg mb-4">
              {error || "Failed to load dashboard"}
            </p>
            <button
              onClick={fetchDashboard}
              className="px-6 py-3 bg-gradient-to-r from-green-700 to-emerald-600 text-white rounded-xl hover:from-green-600 hover:to-emerald-500"
            >
              Retry
            </button>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  // Safely access data with optional chaining and fallbacks
  const userName = data?.user?.name || "User";
  const userRole = data?.user?.role || "member";
  const userStudentId = data?.user?.studentId || "N/A";
  const userDepartment = data?.user?.department || "N/A";
  const userYear = data?.user?.year || "N/A";

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Welcome back, {userName}!
                </h1>
                <p className="text-gray-400">
                  NCC ID: {userStudentId} • {userDepartment} • Year {userYear}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-gray-400 text-sm">Your Role</p>
                  <p className="text-green-400 font-bold text-lg">
                    {userRole.toUpperCase()}
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-green-900/30 to-emerald-800/30 rounded-full flex items-center justify-center border border-green-700/30">
                  <span className="text-2xl font-bold text-green-400">
                    {userName.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            <div className="h-1 w-24 bg-gradient-to-r from-green-600 to-emerald-400 mt-4 rounded-full" />
          </div>

          {/* Rest of your dashboard content with safe access */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Attendance Card */}
            <div className="bg-gray-900/70 border border-green-900/30 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-900/30 to-emerald-800/30 rounded-lg flex items-center justify-center mr-4 border border-green-700/30">
                  <span className="text-2xl font-bold text-green-400">✓</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Attendance</h3>
                  <p className="text-gray-400 text-sm">Overall Percentage</p>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Performance</span>
                  <span>{data?.attendancePercentage || 0}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-400 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${data?.attendancePercentage || 0}%` }}
                  />
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Attended {data?.attendedEvents || 0} of {data?.totalEvents || 0}{" "}
                events
              </p>
            </div>

            {/* Achievements Card */}
            <div className="bg-gray-900/70 border border-green-900/30 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-900/30 to-emerald-800/30 rounded-lg flex items-center justify-center mr-4 border border-green-700/30">
                  <span className="text-2xl font-bold text-green-400">🏆</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Achievements</h3>
                  <p className="text-gray-400 text-sm">Total Earned</p>
                </div>
              </div>
              <div className="text-center mb-4">
                <p className="text-5xl font-bold text-white mb-2">
                  {data?.achievements?.length || 0}
                </p>
                <p className="text-gray-400">Certificates & Awards</p>
              </div>
            </div>

            {/* Upcoming Events Card */}
            <div className="bg-gray-900/70 border border-green-900/30 rounded-2xl p-6">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-900/30 to-emerald-800/30 rounded-lg flex items-center justify-center mr-4 border border-green-700/30">
                  <span className="text-2xl font-bold text-green-400">📅</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Upcoming Events
                  </h3>
                  <p className="text-gray-400 text-sm">Next Activities</p>
                </div>
              </div>
              <div className="space-y-3">
                {data?.upcomingEvents?.slice(0, 2).map((event: any) => (
                  <div
                    key={event._id}
                    className="p-3 bg-gray-800/50 rounded-lg border border-green-900/20"
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-white font-medium truncate">
                        {event.title}
                      </span>
                      <span className="text-xs text-green-400 bg-green-900/30 px-2 py-1 rounded">
                        {event.type}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400">
                      {new Date(event.date).toLocaleDateString()}
                    </p>
                  </div>
                ))}
                {(!data?.upcomingEvents ||
                  data.upcomingEvents.length === 0) && (
                  <p className="text-gray-400 text-center py-2">
                    No upcoming events
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
