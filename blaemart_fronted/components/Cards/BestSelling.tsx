'use client';

import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

// API product type
interface ApiProduct {
  id: number;
  name: string;
  slug: string;
  price: string;
  image?: string;
  in_stock: boolean;
}

// Product type for Card
interface Product {
  id: number;
  title: string;
  description: string;
  imageSrc: string;
  rating: number;
}

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("http://127.0.0.1:8000/store/products/", {
          headers: {
            "X-CSRFTOKEN": "AmB5pT79Nv972qOqWVTNiMnUfmezrXCqAGdBaU6SdJpQJpzO4rZax9ngrsPBhz2K",
          },
        });
        if (!res.ok) throw new Error("Failed to fetch products");

        const data: ApiProduct[] = await res.json();

        const mappedProducts: Product[] = data.map((item) => ({
          id: item.id,
          title: item.name,
          description: `Price: $${item.price}`, // or use slug as description
          imageSrc: item.image
            ? decodeURIComponent(item.image.replace("/media/", "")) // fix URL
            : "/images/pngwing-3.png",
          rating: 4.5,
        }));

        setProducts(mappedProducts.slice(0, 12)); // limit to 12
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  if (loading) return <p>Loading products...</p>;
  if (!products.length) return <p>No products found.</p>;

  return (

    <>

        
   
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        
      {products.map((product) => (
        <ProductCard
          key={product.id}
          title={product.title}
          description={product.description}
          imageSrc={product.imageSrc}
          rating={product.rating}
        />
      ))}
    </div>
   
   
     </>
  );
}
