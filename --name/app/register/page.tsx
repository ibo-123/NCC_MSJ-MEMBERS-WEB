"use client";

import { useForm } from "react-hook-form";
import API from "@/lib/api";
import { useRouter } from "next/navigation";

type RegisterForm = {
  name: string;
  email: string;
  password: string;
  studentId: string;
  year: string;
  department: string;
};

export default function Register() {
  const { register, handleSubmit } = useForm<RegisterForm>();
  const router = useRouter();

  const onSubmit = async (data: RegisterForm) => {
    try {
      await API.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
        studentId: data.studentId,
        year: data.year,
        department: data.department,
      });

      alert("Registration successful. Please login.");
      router.push("/login");
    } catch (err: any) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-gray-800 p-6 rounded">
      <h2 className="text-2xl font-bold mb-4">Create Account</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input
          {...register("name")}
          placeholder="Full Name"
          className="input"
        />
        <input {...register("email")} placeholder="Email" className="input" />
        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className="input"
        />
        <input
          {...register("studentId")}
          placeholder="Student ID"
          className="input"
        />
        <input {...register("year")} placeholder="Year" className="input" />
        <input
          {...register("department")}
          placeholder="Department"
          className="input"
        />

        <button className="w-full bg-green-600 py-2 rounded hover:bg-green-700">
          Register
        </button>
      </form>
    </div>
  );
}
