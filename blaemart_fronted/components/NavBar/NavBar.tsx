'use client';

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchBar from "../SearchBar";
import { FaShoppingCart } from "react-icons/fa"; // Using react-icons for cart icon

export default function NavBar() {
  const router = useRouter();

  // Global search handler
  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/shop?search=${encodeURIComponent(query)}`); // lowercase shop
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
          <Link href="/shop">Shop</Link> {/* lowercase for URL */}
          <Link href="/about">About Us</Link>

          {/* Cart Icon */}
          <Link href="/cart">
            <div className="relative cursor-pointer">
              <FaShoppingCart className="text-2xl text-gray-700 hover:text-[#FF4400] transition-colors" />
              {/* Optional: cart item count badge */}
              <span className="absolute -top-2 -right-2 bg-[#FF383C] text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                3 {/* Replace with dynamic cart count */}
              </span>
            </div>
          </Link>

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
