"use client";

import { useState } from "react";
import API from "@/lib/api";
import ProtectedRoute from "@/components/UI/protectedRoutes";

export default function AchievementsPage() {
  const [form, setForm] = useState({
    user: "",
    title: "",
    description: "",
  });

  const submit = async (e: any) => {
    e.preventDefault();
  await API.post("/achievements", form);
    alert("Achievement added");
  };

  return (
    // <ProtectedRoute>
      <div>
        <h1 className="text-2xl font-bold mb-4">Add Achievement</h1>

        <form onSubmit={submit} className="bg-gray-800 p-4 rounded">
          <input
            placeholder="User ID"
            className="input mb-2"
            onChange={(e) => setForm({ ...form, user: e.target.value })}
          />
          <input
            placeholder="Title"
            className="input mb-2"
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            placeholder="Description"
            className="input mb-2"
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button className="bg-green-600 px-4 py-2 rounded">Submit</button>
        </form>
      </div>
    // </ProtectedRoute>
  );
}
