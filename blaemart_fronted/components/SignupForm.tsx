'use client';

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

interface FormData {
  newPassword: string;
  confirmPassword: string;
}

interface FormErrors {
  general?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const SetPasswordForm: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const uid = searchParams.get('uid');

  const [formData, setFormData] = useState<FormData>({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  // Safely get current URL (avoid SSR window error)
  const [currentUrl] = useState<string>(
    typeof window !== "undefined" ? window.location.href : ""
  );

  // Logging token/uid
  useEffect(() => {
    console.log("Token:", token);
    console.log("UID:", uid);
  }, [token, uid]);

  const validatePassword = (password: string): boolean => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return (
      password.length >= minLength &&
      hasUpperCase &&
      hasLowerCase &&
      hasNumbers &&
      hasSpecialChar
    );
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const passwordStrength = (password: string) => {
    if (!password) return 0;
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
    return strength;
  };

  const strength = passwordStrength(formData.newPassword);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token || !uid) {
      setErrors({ general: "Invalid reset link. Use the link from your email." });
      return;
    }

    setIsLoading(true);
    setErrors({});
    setSuccessMessage("");

    if (!validatePassword(formData.newPassword)) {
      setErrors({
        newPassword: "Password must be at least 8 characters and contain uppercase, lowercase, number, and special character"
      });
      setIsLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Passwords do not match" });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/auth/users/reset_password_confirm/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          uid,
          token,
          new_password: formData.newPassword,
          re_new_password: formData.confirmPassword,
        }),
      });

      const data = await response.json();
      console.log("Response status:", response.status);
      console.log("Response data:", data);

      if (!response.ok) {
        if (data.token) {
          setErrors({ general: "Invalid or expired token" });
        } else if (data.new_password) {
          const errorMsg = Array.isArray(data.new_password) ? data.new_password.join(" ") : data.new_password;
          setErrors({ general: errorMsg });
        } else if (data.detail) {
          setErrors({ general: data.detail });
        } else {
          setErrors({ general: "Failed to reset password" });
        }
        setIsLoading(false);
        return;
      }

      setSuccessMessage("Password reset successful! Redirecting...");
      setTimeout(() => router.push("/SignIn"), 3000);

    } catch (error) {
      console.error("Network error:", error);
      setErrors({ general: "Network error" });
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
              Set New Password
            </h2>

            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-600 text-center">{errors.general}</p>
              </div>
            )}

            {successMessage && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-600 text-center">{successMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700">New Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-400 pr-12"
                    placeholder="Enter new password"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(prev => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-orange-500 hover:text-orange-600"
                    disabled={isLoading}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                {formData.newPassword && (
                  <div className="mt-2">
                    <div className="flex space-x-1 mb-1">
                      {[1,2,3,4,5].map(i => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded ${
                            i <= strength
                              ? strength <= 2 ? 'bg-red-500'
                              : strength <= 3 ? 'bg-yellow-500'
                              : 'bg-green-500'
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <p className={`text-xs ${
                      strength <= 2 ? 'text-red-600' :
                      strength <= 3 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {strength <= 2 ? "Weak" : strength <= 3 ? "Fair" : "Strong"} password
                    </p>
                  </div>
                )}

                <ul className="text-xs text-gray-500 mt-2 space-y-1">
                  <li className={formData.newPassword.length >= 8 ? "text-green-600" : ""}>• At least 8 characters</li>
                  <li className={/[A-Z]/.test(formData.newPassword) ? "text-green-600" : ""}>• One uppercase letter</li>
                  <li className={/[a-z]/.test(formData.newPassword) ? "text-green-600" : ""}>• One lowercase letter</li>
                  <li className={/\d/.test(formData.newPassword) ? "text-green-600" : ""}>• One number</li>
                  <li className={/[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword) ? "text-green-600" : ""}>• One special character</li>
                </ul>

                {errors.newPassword && <p className="text-sm text-red-600 mt-1">{errors.newPassword}</p>}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-orange-400"
                  placeholder="Confirm new password"
                  required
                  disabled={isLoading}
                />
                {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2.5 text-white rounded-md font-medium transition-all ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#FF8D28] hover:bg-[#FF4400] hover:shadow-lg'
                }`}
              >
                {isLoading ? "Setting Password..." : "Set Password"}
              </button>
            </form>

            <div className="text-center text-sm text-gray-500">
              Remember your password?{" "}
              <Link href="/SignIn" className="text-orange-500 hover:text-orange-600 hover:underline font-medium transition">
                Sign in
              </Link>
            </div>

            <div className="mt-4 text-xs text-blue-700">
              <p>Debug Info:</p>
              <p>Token: {token ? "✅ Found" : "❌ Missing"}</p>
              <p>UID: {uid ? "✅ Found" : "❌ Missing"}</p>
              <p>URL: {currentUrl}</p>
              <p>Endpoint: http://127.0.0.1:8000/auth/users/reset_password_confirm/</p>
              <p>How to use this page:</p>
              <ul className="list-disc ml-4">
                <li>Go to Forgot Password page</li>
                <li>Enter your email and submit</li>
                <li>Check Django console for the reset link</li>
                <li>Click that link to access this page</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetPasswordForm;
