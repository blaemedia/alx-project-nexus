"use client";

import React, { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SearchBar from "../SearchBar";

interface CartItem {
  id: number;
  product: number;
  quantity: number;
  product_name?: string;
}

export default function NavBar() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Fetch cart items
  const fetchCartItems = useCallback(async (token: string) => {
    try {
      console.log("NavBar: Fetching cart items...");
      const res = await fetch("http://127.0.0.1:8000/store/cart-items/", {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        console.log("NavBar: Cart data received:", data);
        if (Array.isArray(data)) {
          setCartItems(data);
        }
      }
    } catch (err) {
      console.error("Failed to fetch cart items:", err);
    }
  }, []);

  // Check authentication and fetch cart
  const refreshCart = useCallback(async () => {
    const token = localStorage.getItem("access");
    const authenticated = !!token;
    
    // Wrap state updates in a function
    const updateState = () => {
      setIsAuthenticated(authenticated);
      if (!token) {
        setCartItems([]);
      }
    };
    
    // Execute state updates
    updateState();
    
    if (token) {
      await fetchCartItems(token);
    }
  }, [fetchCartItems]);

  // Initial load - wrapped in async function
  useEffect(() => {
    const initialize = async () => {
      await refreshCart();
    };
    initialize();
  }, [refreshCart]);

  // Refresh cart when page becomes visible (user returns from Shop)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshCart();
      }
    };

    // Refresh on focus
    const handleFocus = () => {
      refreshCart();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshCart]);

  // Calculate total items
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);
  console.log("NavBar: Total items calculated:", totalItems);

  // Global search handler
  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/ShopPage?search=${encodeURIComponent(query)}`);
    }
  };

  // Handle cart click
  const handleCartClick = () => {
    const token = localStorage.getItem("access");
    if (!token) {
      alert("Please login to view your cart");
      router.push("/SignIn");
    } else {
      router.push("/Cart");
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

          {/* Cart Icon with Badge */}
          <div className="relative cursor-pointer" onClick={handleCartClick}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-8 w-8 text-gray-700 hover:text-[#FF4400] transition-colors"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" 
              />
            </svg>
            
            {/* Cart Badge */}
            {isAuthenticated && totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#FF4400] text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </div>

          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 mt-2 md:mt-0">
            {isAuthenticated ? (
              <>
                <Link href="/CustomerAcct">
                  <button className="bg-gray-300 px-4 py-1 rounded-xl border-2 border-gray-200 hover:bg-[#FF383C] text-gray-50">
                    Account
                  </button>
                </Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("access");
                    localStorage.removeItem("refresh");
                    setIsAuthenticated(false);
                    setCartItems([]);
                    router.push("/");
                  }}
                  className="text-sm underline text-[#FF383C] p-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
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
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}