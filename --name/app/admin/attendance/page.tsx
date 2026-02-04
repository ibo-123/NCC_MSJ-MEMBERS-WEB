"use client";

import { useState } from "react";
import API from "@/lib/api";
import ProtectedRoute from "@/components/UI/protectedRoutes";

export default function AttendancePage() {
  const [form, setForm] = useState({
    user: "",
    event: "",
    status: "present",
  });

  const submit = async (e: any) => {
    e.preventDefault();
    await API.post("/attendance", form);
    alert("Attendance marked");
  };

  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-2xl font-bold mb-4">Mark Attendance</h1>

        <form onSubmit={submit} className="bg-gray-800 p-4 rounded">
          <input
            placeholder="User ID"
            className="input mb-2"
            onChange={(e) => setForm({ ...form, user: e.target.value })}
          />
          <input
            placeholder="Event ID"
            className="input mb-2"
            onChange={(e) => setForm({ ...form, event: e.target.value })}
          />
          <select
            className="input mb-2"
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option value="present">Present</option>
            <option value="absent">Absent</option>
          </select>
          <button className="bg-green-600 px-4 py-2 rounded">Submit</button>
        </form>
      </div>
    </ProtectedRoute>
  );
}
