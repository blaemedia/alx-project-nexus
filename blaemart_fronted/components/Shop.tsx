"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "../components/Cards/ProductCard";

const API_BASE_URL = "http://127.0.0.1:8000";

interface Product {
  id: number;
  name: string;
  price: string;
  image?: string | null;
}

interface CartItem {
  id: number;
  product: number;
  quantity: number;
}

const ITEMS_PER_PAGE = 12;

export default function Shop() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [page, setPage] = useState(1);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/store/products/`);
        const data: Product[] = await res.json();

        const filtered = searchQuery
          ? data.filter((p) => p.name.toLowerCase().includes(searchQuery))
          : data;

        setProducts(filtered);
        setPage(1);
      } catch (err) {
        console.error("Failed to fetch products:", err);
      }
    };

    fetchProducts();
  }, [searchQuery]);

  // Fetch cart items with Bearer token
  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("access");
      
      if (!token) {
        // User not logged in
        setCartItems([]);
        return;
      }

      try {
        const res = await fetch(`${API_BASE_URL}/store/cart-items/`, {
          headers: {
            "Authorization": `Bearer ${token}`, // ✅ Modern standard
          },
        });
        
        if (res.status === 401) {
          // Token expired
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          setCartItems([]);
          return;
        }
        
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        
        const data = await res.json();
        
        // Handle response
        if (Array.isArray(data)) {
          setCartItems(data);
        } else {
          setCartItems([]);
        }
      } catch (err) {
        console.error("Failed to fetch cart items:", err);
        setCartItems([]);
      }
    };

    fetchCart();
  }, []);

  // Add product to cart with Bearer token
  const addToCart = async (product: Product) => {
    const token = localStorage.getItem("access");
    
    if (!token) {
      alert("Please login to add items to cart");
      return;
    }

    try {
      const existing = cartItems.find((item) => item.product === product.id);

      const payload = {
        product: product.id,
        quantity: existing ? existing.quantity + 1 : 1,
      };

      const headers = {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`, // ✅ Modern standard
      };

      if (existing) {
        await fetch(`${API_BASE_URL}/store/cart-items/${existing.id}/`, {
          method: "PATCH",
          headers,
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(`${API_BASE_URL}/store/cart-items/`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
      }

      // Refresh cart
      const res = await fetch(`${API_BASE_URL}/store/cart-items/`, {
        headers: { "Authorization": `Bearer ${token}` },
      });
      
      if (res.ok) {
        const data = await res.json();
        setCartItems(Array.isArray(data) ? data : []);
      }

      alert(`${product.name} added to cart`);
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert("Failed to add to cart. Try again.");
    }
  };

  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Shop</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {paginatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            title={product.name.replace(/\d+$/, "").trim()}
            description={`₦${Number(product.price).toLocaleString()}`}
            imageSrc={
              product.image ? `${API_BASE_URL}${product.image}` : undefined
            }
            rating={4.5}
            onBuy={() => addToCart(product)}
          />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="px-4 py-2 font-bold">Page {page}</span>

        <button
          disabled={start + ITEMS_PER_PAGE >= products.length}
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}