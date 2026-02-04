"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import ProtectedRoute from "@/components/UI/protectedRoutes";

export default function CoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [form, setForm] = useState({
    title: "",
    instructor: "",
    description: "",
    youtubelink: "",
  });

  const loadCourses = async () => {
    const res = await API.get("/courses");
    setCourses(res.data.data);
  };

  const addCourse = async (e: any) => {
    e.preventDefault();
    await API.post("/courses", form);
    setForm({ title: "", instructor: "", description: "", youtubelink: "" });
    loadCourses();
  };

  const deleteCourse = async (id: string) => {
    await API.delete(`/courses/${id}`);
    loadCourses();
  };

  useEffect(() => {
    loadCourses();
  }, []);

  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-2xl font-bold mb-4">Courses</h1>

        <form onSubmit={addCourse} className="bg-gray-800 p-4 rounded mb-4">
          <input
            placeholder="Title"
            className="input mb-2"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            placeholder="Instructor"
            className="input mb-2"
            value={form.instructor}
            onChange={(e) => setForm({ ...form, instructor: e.target.value })}
          />
          <input
            placeholder="YouTube Link"
            className="input mb-2"
            value={form.youtubelink}
            onChange={(e) => setForm({ ...form, youtubelink: e.target.value })}
          />
          <textarea
            placeholder="Description"
            className="input mb-2"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button className="bg-green-600 px-4 py-2 rounded">Add Course</button>
        </form>

        <ul>
          {courses.map((c) => (
            <li
              key={c._id}
              className="bg-gray-800 p-3 rounded mb-2 flex justify-between"
            >
              <span>
                {c.title} — {c.instructor}
              </span>
              <button
                onClick={() => deleteCourse(c._id)}
                className="bg-red-600 px-2 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </ProtectedRoute>
  );
}
