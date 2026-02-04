"use client";

import { useEffect, useState } from "react";
import API from "@/lib/api";
import ProtectedRoute from "@/components/UI/protectedRoutes";

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);

  const loadUsers = async () => {
    const res = await API.get("/users");
    setUsers(res.data.data);
  };

  const deleteUser = async (id: string) => {
    if (!confirm("Delete this user?")) return;
    await API.delete(`/users/${id}`);
    loadUsers();
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <ProtectedRoute>
      <div>
        <h1 className="text-2xl font-bold mb-4">Users</h1>

        <table className="w-full bg-gray-800 rounded">
          <thead>
            <tr className="bg-black">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Role</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-t">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">
                  <button
                    onClick={() => deleteUser(u._id)}
                    className="bg-red-600 px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ProtectedRoute>
  );
}
