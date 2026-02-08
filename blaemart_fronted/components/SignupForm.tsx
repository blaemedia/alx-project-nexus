"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

interface FormData {
  email: string;
  password: string;
  re_password: string;
}

interface FormErrors {
  [key: string]: string | string[];
}

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    re_password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value ?? "" }));

    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.re_password) {
      newErrors.re_password = "Please confirm your password";
    } else if (formData.password !== formData.re_password) {
      newErrors.re_password = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("");

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/users/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const text = await response.text();
      const data = text ? JSON.parse(text) : {};

      if (!response.ok) {
        setErrors(data);
      } else {
        setSuccessMessage("Account created successfully! You can now log in.");
        setFormData({ email: "", password: "", re_password: "" });
      }
    } catch {
      setErrors({ general: "Network error. Please check your connection." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* IMAGE SECTION (same as SignIn) */}
        <div className="relative hidden md:block min-h-[500px]">
          <Image
            src="/images/BlaeStoreImage.jpg"
            alt="Fashion"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* FORM SECTION */}
        <div className="flex items-center justify-center p-10">
          <div className="w-full max-w-md space-y-6">
            <h2 className="text-3xl font-bold text-center text-gray-900">
              Create your account
            </h2>

            {errors.general && (
              <p className="text-sm text-red-600 text-center">
                {errors.general}
              </p>
            )}

            {successMessage && (
              <p className="text-sm text-green-600 text-center">
                {successMessage}
              </p>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-400"
                  placeholder="you@example.com"
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-400 pr-12"
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-orange-500"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  name="re_password"
                  type={showPassword ? "text" : "password"}
                  value={formData.re_password}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-400"
                  placeholder="Confirm password"
                  required
                />
                {errors.re_password && (
                  <p className="text-sm text-red-600">
                    {errors.re_password}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 text-white rounded-md bg-[#FF8D28] hover:bg-[#FF4400] transition disabled:opacity-60"
              >
                {isLoading ? "Creating account..." : "Sign up"}
              </button>
            </form>

            <div className="text-center text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/SignIn" className="text-orange-500 hover:underline">
                Sign in
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default SignupForm;
