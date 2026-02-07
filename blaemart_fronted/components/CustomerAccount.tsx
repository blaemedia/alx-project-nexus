"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
}

const CustomerAccount: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Fetch user info on load
  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      // No token → redirect to login
      router.push("/SignIn");
      return;
    }

    fetch("http://127.0.0.1:8000/auth/users/me/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch user");
        }
        return res.json();
      })
      .then((data: User) => setUser(data))
      .catch(() => {
        // Invalid token → remove tokens & redirect to login
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        router.push("/SignIn");
      })
      .finally(() => setLoading(false));
  }, [router]);

  // ✅ Logout → remove tokens & redirect to Home page
  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    router.push("/"); // Redirect to home page
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading your account...</p>
      </div>
    );
  }

  if (!user) return null; // user is redirected

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Account Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">
            Welcome, {user.first_name || user.email}!
          </h2>
          <p className="text-gray-600">Here is your account information:</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Info */}
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">Profile Info</h3>
            <p><strong>Email:</strong> {user.email}</p>
            {user.first_name && <p><strong>First Name:</strong> {user.first_name}</p>}
            {user.last_name && <p><strong>Last Name:</strong> {user.last_name}</p>}
          </div>

          {/* Orders / Placeholder */}
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">Orders</h3>
            <p>No orders yet.</p>
          </div>

          {/* Wishlist / Placeholder */}
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">Wishlist</h3>
            <p>No items in your wishlist.</p>
          </div>

          {/* Addresses / Placeholder */}
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">Saved Addresses</h3>
            <p>No addresses saved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAccount;
