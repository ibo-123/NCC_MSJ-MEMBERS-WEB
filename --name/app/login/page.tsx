"use client";

import { useForm } from "react-hook-form";
import API from "@/lib/api";
import { saveToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

type LoginForm = {
  email: string;
  password: string;
};

export default function Login() {
  const { register, handleSubmit } = useForm<LoginForm>();
  const router = useRouter();

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await API.post("/auth/login", data);

      const token = res.data.data.token;
      saveToken(token);

      router.push("/dashboard");
    } catch (err: any) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-gray-800 p-6 rounded">
      <h2 className="text-2xl font-bold mb-4">Login</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <input {...register("email")} placeholder="Email" className="input" />
        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className="input"
        />

        <button className="w-full bg-green-600 py-2 rounded hover:bg-green-700">
          Login
        </button>
      </form>
    </div>
  );
}
