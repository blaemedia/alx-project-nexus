"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/Cards/ProductCard";

interface Product {
  id: number;
  name: string;
  price: string;
  image?: string | null;
}

interface CartItem extends Product {
  quantity: number;
}

const ITEMS_PER_PAGE = 12;

export default function Shop() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);

  const addToCart = (product: Product) => {
    const cart: CartItem[] = JSON.parse(localStorage.getItem("cart") || "[]");
    const existing = cart.find((item) => item.id === product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart`);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("http://127.0.0.1:8000/store/products/");
      const data: Product[] = await res.json();

      const filtered = searchQuery
        ? data.filter((p) =>
            p.name.toLowerCase().includes(searchQuery)
          )
        : data;

      setProducts(filtered);
      setPage(1);
    };

    fetchProducts();
  }, [searchQuery]);

  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(start, start + ITEMS_PER_PAGE);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6 text-center">Shop</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {paginatedProducts.map((product) => (
          <ProductCard
            key={product.id}
            // Remove trailing numbers from product name
            title={product.name.replace(/\d+$/, "").trim()}
            description={`₦${Number(product.price).toLocaleString()}`}
            imageSrc={
              product.image ? `http://127.0.0.1:8000${product.image}` : undefined
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
