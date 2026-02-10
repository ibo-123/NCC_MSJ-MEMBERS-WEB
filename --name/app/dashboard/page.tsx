"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import ProtectedRoute from "@/components/UI/protectedRoutes";

interface Achievement {
  _id: string;
  title: string;
  description: string;
  category: string;
  level: string;
  date: string;
  verified: boolean;
}

interface DashboardData {
  user: {
    name: string;
    email: string;
    studentId: string;
    department: string;
    year: string;
    role: string;
  };
  attendancePercentage: number;
  totalEvents: number;
  attendedEvents: number;
  achievements: Achievement[];
  recentEvents: Array<{
    _id: string;
    title: string;
    date: string;
    status: string;
  }>;
  upcomingEvents: Array<{
    _id: string;
    title: string;
    date: string;
    type: string;
  }>;
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await API.get("/dashboard");
      setData(res.data.data);
    } catch (error) {
      console.error("Error fetching dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

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

  if (!data) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <div className="text-center">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">⚠️</span>
            </div>
            <p className="text-gray-400 text-lg mb-4">
              Failed to load dashboard
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

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      NCC: "bg-red-500/10 text-red-400 border-red-500/30",
      Sports: "bg-blue-500/10 text-blue-400 border-blue-500/30",
      Academic: "bg-green-500/10 text-green-400 border-green-500/30",
      Leadership: "bg-purple-500/10 text-purple-400 border-purple-500/30",
      Cultural: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    };
    return (
      colors[category] || "bg-gray-500/10 text-gray-400 border-gray-500/30"
    );
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Welcome back, {data.user.name}!
                </h1>
                <p className="text-gray-400">
                  NCC ID: {data.user.studentId} • {data.user.department} • Year{" "}
                  {data.user.year}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-gray-400 text-sm">Your Role</p>
                  <p className="text-green-400 font-bold text-lg">
                    {data.user.role.toUpperCase()}
                  </p>
                </div>
                <div className="w-16 h-16 bg-gradient-to-br from-green-900/30 to-emerald-800/30 rounded-full flex items-center justify-center border border-green-700/30">
                  <span className="text-2xl font-bold text-green-400">
                    {data.user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
            <div className="h-1 w-24 bg-gradient-to-r from-green-600 to-emerald-400 mt-4 rounded-full" />
          </div>

          {/* Stats Grid */}
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
                  <span>{data.attendancePercentage}%</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-green-500 to-emerald-400 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${data.attendancePercentage}%` }}
                  />
                </div>
              </div>
              <p className="text-gray-400 text-sm">
                Attended {data.attendedEvents} of {data.totalEvents} events
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
                  {data.achievements.length}
                </p>
                <p className="text-gray-400">Certificates & Awards</p>
              </div>
              <div className="flex justify-between text-sm text-gray-400">
                <span>
                  Verified: {data.achievements.filter((a) => a.verified).length}
                </span>
                <span>
                  NCC:{" "}
                  {data.achievements.filter((a) => a.category === "NCC").length}
                </span>
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
                {data.upcomingEvents.slice(0, 2).map((event) => (
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
                {data.upcomingEvents.length === 0 && (
                  <p className="text-gray-400 text-center py-2">
                    No upcoming events
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Achievements Section */}
            <div className="bg-gray-900/70 border border-green-900/30 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  Recent Achievements
                </h2>
                <span className="text-green-400 text-sm font-medium">
                  {data.achievements.length} total
                </span>
              </div>

              {data.achievements.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <p className="text-gray-400">No achievements yet</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Participate in events to earn achievements!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.achievements.slice(0, 5).map((achievement) => (
                    <div
                      key={achievement._id}
                      className="p-4 bg-gray-800/50 rounded-xl border border-green-900/20 hover:border-green-500/30 transition-all"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-white">
                          {achievement.title}
                        </h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs ${getCategoryColor(achievement.category)}`}
                        >
                          {achievement.category}
                        </span>
                      </div>
                      <p className="text-gray-300 mb-3">
                        {achievement.description}
                      </p>
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Level:</span>
                          <span className="text-white font-medium">
                            {achievement.level}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">Date:</span>
                          <span className="text-white">
                            {new Date(achievement.date).toLocaleDateString()}
                          </span>
                        </div>
                        {achievement.verified && (
                          <span className="text-green-400 text-sm">
                            ✓ Verified
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Recent Activity Section */}
            <div className="bg-gray-900/70 border border-green-900/30 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">
                Recent Activity
              </h2>

              {data.recentEvents.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <p className="text-gray-400">No recent activity</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {data.recentEvents.slice(0, 5).map((event) => (
                    <div
                      key={event._id}
                      className="flex items-center p-4 bg-gray-800/50 rounded-xl border border-green-900/20"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-900/30 to-emerald-800/30 flex items-center justify-center mr-4 border border-green-700/30">
                        <span className="text-lg">📅</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium">
                          {event.title}
                        </h3>
                        <div className="flex items-center text-sm text-gray-400">
                          <span>
                            {new Date(event.date).toLocaleDateString()}
                          </span>
                          <span className="mx-2">•</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              event.status === "Completed"
                                ? "bg-green-500/10 text-green-400"
                                : event.status === "Upcoming"
                                  ? "bg-blue-500/10 text-blue-400"
                                  : "bg-yellow-500/10 text-yellow-400"
                            }`}
                          >
                            {event.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Quick Stats */}
              <div className="mt-8 pt-6 border-t border-green-900/30">
                <h3 className="text-lg font-bold text-white mb-4">
                  Quick Stats
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-gray-800/30 rounded-xl border border-green-900/20">
                    <p className="text-gray-400 text-sm">Events This Month</p>
                    <p className="text-2xl font-bold text-white">0</p>
                  </div>
                  <div className="p-4 bg-gray-800/30 rounded-xl border border-green-900/20">
                    <p className="text-gray-400 text-sm">Current Streak</p>
                    <p className="text-2xl font-bold text-white">0 days</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
