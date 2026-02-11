"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: number;
  email: string;
  first_name?: string;
  last_name?: string;
  username?: string;
}

const CustomerAccount: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch user info on load
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("access");

      if (!token) {
        // No token → redirect to login
        router.push("/SignIn");
        return;
      }

      try {
        // ✅ CHANGED: Use local backend URL
        const response = await fetch("http://127.0.0.1:8000/auth/users/me/", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("User fetch status:", response.status);

        if (!response.ok) {
          // Check if token is invalid/expired
          if (response.status === 401) {
            console.log("Token invalid/expired");
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            router.push("/SignIn");
            return;
          }
          throw new Error(`Failed to fetch user: ${response.status}`);
        }

        const data: User = await response.json();
        console.log("User data received:", data);
        setUser(data);
        setError(null);
      } catch (err) {
        console.error("Error fetching user:", err);
        setError("Failed to load account information");
        
        // Only redirect on auth errors, not network errors
        if (err instanceof Error && err.message.includes("401")) {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          router.push("/SignIn");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
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
        <div className="text-lg">Loading your account...</div>
      </div>
    );
  }

  if (error && !user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-red-600 text-lg mb-4">{error}</div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <div className="text-xl mb-4">You need to be logged in to view this page</div>
        <button
          onClick={() => router.push("/SignIn")}
          className="px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600"
        >
          Sign In
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Account Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
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
          <div className="bg-gray-50 p-4 rounded border">
            <h3 className="font-semibold mb-3 text-lg">Profile Information</h3>
            <div className="space-y-2">
              <p><strong className="text-gray-700">Email:</strong> {user.email}</p>
              {user.username && <p><strong className="text-gray-700">Username:</strong> {user.username}</p>}
              {user.first_name && <p><strong className="text-gray-700">First Name:</strong> {user.first_name}</p>}
              {user.last_name && <p><strong className="text-gray-700">Last Name:</strong> {user.last_name}</p>}
              <p><strong className="text-gray-700">User ID:</strong> {user.id}</p>
            </div>
          </div>

          {/* Orders / Placeholder */}
          <div className="bg-gray-50 p-4 rounded border">
            <h3 className="font-semibold mb-3 text-lg">Recent Orders</h3>
            <p className="text-gray-500">No orders yet.</p>
            <button className="mt-3 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition">
              Start Shopping
            </button>
          </div>

          {/* Wishlist / Placeholder */}
          <div className="bg-gray-50 p-4 rounded border">
            <h3 className="font-semibold mb-3 text-lg">Wishlist</h3>
            <p className="text-gray-500">No items in your wishlist.</p>
            <button className="mt-3 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition">
              Browse Products
            </button>
          </div>

          {/* Addresses / Placeholder */}
          <div className="bg-gray-50 p-4 rounded border">
            <h3 className="font-semibold mb-3 text-lg">Saved Addresses</h3>
            <p className="text-gray-500">No addresses saved.</p>
            <button className="mt-3 px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition">
              Add Address
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 pt-6 border-t">
          <h3 className="font-semibold mb-4 text-lg">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition">
              Edit Profile
            </button>
            <button className="px-4 py-2 bg-green-100 text-green-700 rounded hover:bg-green-200 transition">
              Change Password
            </button>
            <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition">
              View Order History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerAccount;