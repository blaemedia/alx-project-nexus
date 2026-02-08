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

interface CartItem {
  id: number;
  product: number;
  quantity: number;
}

interface Product {
  id: number;
  title: string;
  description: string;
  imageSrc: string;
  rating: number;
  raw: ApiProduct;
}

const FALLBACK_IMAGE = "/images/pngwing-3.png";
const BACKEND_URL = "http://127.0.0.1:8000";

export default function BestSelling() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Add to cart function using API
  const addToCart = async (product: ApiProduct) => {
    const token = localStorage.getItem("access");
    
    if (!token) {
      alert("Please login to add items to cart");
      return;
    }

    try {
      // First, check if item already exists in cart
      const cartRes = await fetch(`${BACKEND_URL}/store/cart-items/`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (cartRes.ok) {
        const cartData = await cartRes.json();
        const existingItem = Array.isArray(cartData) 
          ? cartData.find((item: CartItem) => item.product === product.id)
          : null;

        if (existingItem) {
          // Update quantity
          await fetch(`${BACKEND_URL}/store/cart-items/${existingItem.id}/`, {
            method: "PATCH",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              quantity: existingItem.quantity + 1,
            }),
          });
        } else {
          // Add new item
          await fetch(`${BACKEND_URL}/store/cart-items/`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              product: product.id,
              quantity: 1,
            }),
          });
        }

        // Trigger NavBar refresh
        window.dispatchEvent(new Event('cartUpdated'));
        
        alert(`${product.name} added to cart`);
      }
    } catch (err) {
      console.error("Add to cart failed:", err);
      alert("Failed to add to cart. Try again.");
    }
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

        setProducts(mapped.slice(0, 12));
      } catch (err) {
        console.error(err);
        const errorMessage = err instanceof Error ? err.message : "Something went wrong";
        setError(errorMessage);
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
          onBuy={() => addToCart(product.raw)}
        />
      ))}
    </div>
  );
}