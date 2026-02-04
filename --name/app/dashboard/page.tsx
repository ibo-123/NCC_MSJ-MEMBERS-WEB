"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import ProtectedRoute from "@/components/UI/protectedRoutes";

export default function Dashboard() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    API.get("/dashboard").then((res) => {
      setData(res.data.data);
    });
  }, []);

  if (!data) return <p>Loading...</p>;

  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-3xl font-bold mb-4">Welcome, {data.user.name}</h1>
        <p>Email: {data.user.email}</p>
        <p>Attendance: {data.attendancePercentage}%</p>

        <h2 className="text-xl mt-4 mb-2">Achievements</h2>
        <ul>
          {data.achievements.map((a: any) => (
            <li key={a._id} className="bg-gray-800 p-2 mb-2 rounded">
              <strong>{a.title}</strong> — {a.description}
            </li>
          ))}
        </ul>
      </div>
    </ProtectedRoute>
  );
}
