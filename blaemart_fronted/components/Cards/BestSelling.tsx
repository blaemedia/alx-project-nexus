'use client';

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  image?: string | null;
  in_stock: boolean;
}

interface Product {
  id: number;
  title: string;
  description: string;
  imageSrc: string;
  rating: number;
  raw: ApiProduct; // keep original product for Add to Cart
}

const FALLBACK_IMAGE = "/images/pngwing-3.png";
const BACKEND_URL = "http://127.0.0.1:8000";

export default function BestSelling() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add to cart function
  const addToCart = (product: ApiProduct) => {
    const cart: (ApiProduct & { quantity: number })[] = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    const existing = cart.find((item) => item.id === product.id);
    if (existing) existing.quantity += 1;
    else cart.push({ ...product, quantity: 1 });

    localStorage.setItem("cart", JSON.stringify(cart));
    alert(`${product.name} added to cart`);
  };

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(`${BACKEND_URL}/store/products/`);
        if (!res.ok) throw new Error("Failed to fetch products");

        const data: ApiProduct[] = await res.json();

        const mapped: Product[] = data.map((item) => {
          let imageSrc = FALLBACK_IMAGE;
          if (item.image) {
            imageSrc = item.image.startsWith("http")
              ? item.image
              : `${BACKEND_URL}${item.image.startsWith("/") ? "" : "/"}${item.image}`;
          }

          return {
            id: item.id,
            title: item.name.replace(/\d+$/, "").trim(),
            description: `Price: ₦${Number(item.price).toLocaleString()}`,
            imageSrc,
            rating: 4.5,
            raw: item,
          };
        });

        // You can replace slice(0,12) with sorting by popularity if available
        setProducts(mapped.slice(0, 12));
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!products.length) return <p>No products found.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          title={product.title}
          description={product.description}
          imageSrc={product.imageSrc}
          rating={product.rating}
          onBuy={() => addToCart(product.raw)} // Add to Cart
        />
      ))}
    </div>
  );
}
