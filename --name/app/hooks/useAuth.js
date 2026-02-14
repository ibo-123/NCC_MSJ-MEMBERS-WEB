// hooks/useAuth.js
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isLoggedIn, getToken, removeToken, setToken } from "@/lib/auth";

export function useAuth() {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      if (!isLoggedIn()) {
        setLoading(false);
        return;
      }

      // Get user data from localStorage or decode from token
      const userData = localStorage.getItem("user");
      if (userData) {
        setUserState(JSON.parse(userData));
      } else {
        // Fetch user data from API using token
        try {
          const response = await fetch("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${getToken()}`,
            },
          });
          const data = await response.json();
          if (data.success) {
            setUserState(data.data);
            localStorage.setItem("user", JSON.stringify(data.data));
          }
        } catch (error) {
          console.error("Error fetching user:", error);
        }
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = (token, userData) => {
    setToken(token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUserState(userData);
  };

  const logout = () => {
    removeToken();
    localStorage.removeItem("user");
    setUserState(null);
    router.push("/login");
  };

  const updateUser = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUserState(userData);
  };

  return {
    use,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user && isLoggedIn(),
    isAdmin: user?.role === "admin",
  };
}