// app/ForgotPassword/page.tsx
'use client';

import React, { useState } from "react";
import Link from "next/link";

interface ErrorResponse {
  email?: string[];
  detail?: string;
  non_field_errors?: string[];
  [key: string]: string[] | string | undefined;
}

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsLoading(true);
    setError("");
    setSuccess(false);

    try {
      console.log("Sending POST request to:", "http://127.0.0.1:8000/auth/users/reset_password/");
      console.log("With email:", email);

      const response = await fetch(
        "http://127.0.0.1:8000/auth/users/reset_password/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      console.log("Response status:", response.status);

      // Djoser typically returns 204 No Content on success
      if (response.status === 204) {
        console.log("✅ Password reset email sent successfully!");
        setSuccess(true);
        setEmail("");
      } else if (response.ok) {
        console.log("✅ Password reset email sent (200 OK)!");
        setSuccess(true);
        setEmail("");
      } else {
        // Try to parse error response
        let errorData: ErrorResponse = {};
        try {
          const text = await response.text();
          console.log("Error response text:", text);
          if (text) {
            errorData = JSON.parse(text) as ErrorResponse;
          }
        } catch {
          console.log("Could not parse error response");
        }
        
        console.error("API Error data:", errorData);
        
        if (errorData.email && Array.isArray(errorData.email)) {
          setError(`Email error: ${errorData.email[0]}`);
        } else if (errorData.detail) {
          setError(errorData.detail);
        } else if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
          setError(`Error: ${errorData.non_field_errors[0]}`);
        } else {
          setError(`Failed to send reset email. Status: ${response.status}`);
        }
      }
    } catch (error: unknown) {
      console.error("Network error details:", error);
      const errorMessage = error instanceof Error ? error.message : "Unknown network error";
      setError(`Network error: ${errorMessage}. Make sure Django is running.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Forgot your password?
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {success ? (
          <div className="bg-green-50 border border-green-200 rounded-md p-6 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-green-800 mb-2">Check Your Email</h3>
            <p className="text-green-600 mb-2">
              If an account exists with <span className="font-medium">{email}</span>, 
              you will receive a password reset link shortly.
            </p>
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-500">
                <strong>Development Note:</strong> Check your Django console for the reset link.
              </p>
              <div className="mt-4">
                <Link
                  href="/SignIn"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
                >
                  Return to Sign In
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                placeholder="you@example.com"
                disabled={isLoading}
              />
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
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#FF8D28] hover:bg-[#FF4400] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF4400] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Send Reset Link'
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
        )}

        {/* Debug Section - Remove in production */}
        <div className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-md">
          <h4 className="font-medium text-gray-700 mb-2">Debug Information</h4>
          <p className="text-sm text-gray-600">
            <strong>Endpoint:</strong> POST http://127.0.0.1:8000/auth/users/reset_password/
          </p>
          <p className="text-sm text-gray-600">
            <strong>Expected Response:</strong> 204 No Content on success
          </p>
          <button
            onClick={() => {
              console.log("Manual test:");
              console.log("Email:", email);
              console.log("URL:", "http://127.0.0.1:8000/auth/users/reset_password/");
            }}
            className="mt-2 text-xs px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
          >
            Log Debug Info
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;