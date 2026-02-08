"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchBar from "../SearchBar";

export default function NavBar() {
  const router = useRouter();

  // Global search handler
  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/ShopPage?search=${encodeURIComponent(query)}`);
    }
  };

  return (
    <header className="bg-gray-100 shadow sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 p-6">
        {/* Logo */}
        <div className="text-[#FF4400] text-4xl font-bold">
          <Link href="/">Blae|Mart</Link>
        </div>

        {/* Global Search */}
        <div className="flex-1 max-w-md w-full">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* Navigation links */}
        <nav className="flex flex-col md:flex-row items-center text-gray-500 text-2xl gap-4">
          <Link href="/">Home</Link>
          <Link href="/ShopPage">Shop</Link>
          <Link href="/about">About Us</Link>

          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mt-2 md:mt-0">
            <Link href="/SignIn">
              <button className="bg-gray-300 px-4 py-1 rounded-xl border-2 border-gray-200 hover:bg-[#FF383C] text-gray-50">
                Sign In
              </button>
            </Link>

            <Link href="/SignUp">
              <p className="text-sm underline text-[#FF383C] p-2">
                Click for Signing Up
              </p>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
