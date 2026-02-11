// components/PasswordResetForm.tsx
'use client';

import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

interface FormData {
  newPassword: string;
  confirmPassword: string;
}

interface ApiError {
  uid?: string[];
  token?: string[];
  new_password?: string[];
  re_new_password?: string[];
  detail?: string;
  non_field_errors?: string[];
}

const PasswordResetForm: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isValidLink, setIsValidLink] = useState<boolean>(true);

  // Get token and uid from URL
  const token = searchParams.get("token");
  const uid = searchParams.get("uid");

  useEffect(() => {
    // Validate that we have token and uid
    if (!token || !uid) {
      setIsValidLink(false);
      setError("Invalid or expired reset link. Please request a new password reset.");
    }
  }, [token, uid]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!token || !uid) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }

    if (formData.newPassword.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      console.log("Sending password reset request...");
      console.log("UID:", uid);
      console.log("Token:", token.substring(0, 20) + "...");

      const response = await fetch(
        "http://127.0.0.1:8000/auth/users/reset_password_confirm/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uid,
            token,
            new_password: formData.newPassword,
            re_new_password: formData.confirmPassword,
          }),
        }
      );

      console.log("Response status:", response.status, response.statusText);

      // Handle 204 No Content (success with empty response)
      if (response.status === 204) {
        console.log("✅ Password reset successful! (204 No Content)");
        setSuccess(true);
        
        // Redirect to login after 3 seconds
        setTimeout(() => {
          router.push("/SignIn");
        }, 3000);
        
      } else if (response.ok) {
        // Other success status codes (200, etc.)
        try {
          const data = await response.json();
          console.log("Success response:", data);
          setSuccess(true);
          
          setTimeout(() => {
            router.push("/SignIn");
          }, 3000);
          
        } catch (jsonError) {
          console.log("✅ Password reset successful! (Empty response)");
          setSuccess(true);
          
          setTimeout(() => {
            router.push("/SignIn");
          }, 3000);
        }
      } else {
        // Handle error responses
        let errorData: ApiError = {};
        try {
          const text = await response.text();
          if (text) {
            errorData = JSON.parse(text) as ApiError;
          }
        } catch {
          console.log("Could not parse error response");
        }
        
        console.error("API Error data:", errorData);
        
        // Extract error message
        let errorMessage = "Failed to reset password.";
        if (errorData.uid && Array.isArray(errorData.uid)) {
          errorMessage = `Invalid user ID: ${errorData.uid[0]}`;
        } else if (errorData.token && Array.isArray(errorData.token)) {
          errorMessage = `Invalid or expired token: ${errorData.token[0]}`;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
          errorMessage = errorData.non_field_errors[0];
        } else {
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        
        setError(errorMessage);
      }
    } catch (err) {
      console.error("Network error:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isValidLink) {
    return (
      <div className="text-center">
        <div className="bg-red-50 border border-red-200 rounded-md p-6">
          <h3 className="text-lg font-medium text-red-800 mb-2">Invalid Reset Link</h3>
          <p className="text-red-600 mb-4">The password reset link is invalid or has expired.</p>
          <Link
            href="/ForgotPassword"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Request New Reset Link
          </Link>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="text-center">
        <div className="bg-green-50 border border-green-200 rounded-md p-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-green-800 mb-2">Password Reset Successful!</h3>
          <p className="text-green-600 mb-4">
            Your password has been reset successfully. Redirecting to login page...
          </p>
          <div className="mt-4">
            <Link
              href="/SignIn"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-6">
      <div className="rounded-md shadow-sm -space-y-px">
        <div>
          <label htmlFor="newPassword" className="sr-only">
            New Password
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type={showPassword ? "text" : "password"}
            required
            value={formData.newPassword}
            onChange={handleChange}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="New Password (min. 8 characters)"
            disabled={isLoading}
          />
        </div>
        <div className="relative">
          <label htmlFor="confirmPassword" className="sr-only">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
            placeholder="Confirm New Password"
            disabled={isLoading}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
          >
            {showPassword ? (
              <span className="text-gray-500 hover:text-gray-700">Hide</span>
            ) : (
              <span className="text-gray-500 hover:text-gray-700">Show</span>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{error}</h3>
            </div>
          </div>
        </div>
      )}

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Resetting Password...
            </>
          ) : (
            'Reset Password'
          )}
        </button>
      </div>

      <div className="text-center">
        <Link
          href="/SignIn"
          className="font-medium text-blue-600 hover:text-blue-500"
        >
          Back to Sign In
        </Link>
      </div>
    </form>
  );
};

export default PasswordResetForm;