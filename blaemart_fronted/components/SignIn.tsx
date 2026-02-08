'use client';

import React, { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AuthContext } from "./context/AuthContext";

interface FormData {
  email: string;
  password: string;
}

interface FormErrors {
  general?: string;
}

const SignInForm: React.FC = () => {
  const router = useRouter();
  const { setAccessToken } = useContext(AuthContext);

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/jwt/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.detail || "Email or password is incorrect" });
        return;
      }

      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      if (setAccessToken) {
        setAccessToken(data.access);
      }

      router.push("/CustomerAcct");
    } catch (err) {
      console.error(err);
      setErrors({ general: "Network error. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        
        <div className="relative hidden md:block min-h-125">
          <Image
            src="/images/Shopping.jpg"
            alt="Fashion"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="flex items-center justify-center p-10">
          <div className="w-full max-w-md space-y-6">
            <h2 className="text-3xl font-bold text-center text-gray-900">
              Sign in
            </h2>

            {errors.general && (
              <p className="text-sm text-red-600 text-center">{errors.general}</p>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-400"
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-400 pr-12"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-orange-500"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 text-white rounded-md bg-[#FF8D28] hover:bg-[#FF4400] transition disabled:opacity-60"
              >
                {isLoading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="text-center text-sm text-gray-500">
              Don&apos;t have an account?{" "}
              <Link href="/SignUp" className="text-orange-500 hover:underline">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInForm;