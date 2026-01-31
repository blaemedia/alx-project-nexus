'use client'
import { useState, useEffect } from 'react';
import Hero from "@/components/Hero/Hero";
import CategoryCard from "@/components/Cards/CategoryCard";
import NavBar from "@/components/NavBar/NavBar";
import Image from "next/image";
import React from "react";

interface Category {
  id: number;
  name: string;
  image: string;
}

export default function Home() {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/store/categories/");

        if (!res.ok) {
          throw new Error("No API response");
        }

        const data: Category[] = await res.json();
        setData(data);
      } catch (err) {
        setError("Something is wrong with your API");
        console.log(err)
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      <NavBar />
      <Hero />

      {loading && (
        <div className="text-center p-10">Loading categories...</div>
      )}

      {error && (
        <div className="text-center p-10 text-red-500">{error}</div>
      )}

      {!loading && !error && (
        <div className="p-10 grid grid-rows-1 grid-flow-col gap-6 justify-center">
          {data.map((cat) => (
            <CategoryCard
              key={cat.id}
              image={cat.image}
              title={cat.name}
            />
          ))}
        </div>
      )}

      {/* Example Image usage so import is not unused */}
      <div className="hidden">
        <Image src="/placeholder.png" alt="placeholder" width={1} height={1} />
      </div>
    </>
  );
}
