'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CategoryCard from './CategoryCard';

interface Category {
  id: number;
  name: string;       // category name
  cat_thumbnail: string;
}

const API_BASE_URL = 'http://127.0.0.1:8000';

const getImageUrl = (imagePath: string): string => {
  if (!imagePath || imagePath === '') {
    return 'https://via.placeholder.com/300x200.png?text=No+Image';
  }

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  if (imagePath.startsWith('/media/')) {
    return `${API_BASE_URL}${imagePath}`;
  }

  if (imagePath.startsWith('/')) {
    return `${API_BASE_URL}${imagePath}`;
  }

  return `${API_BASE_URL}/media/${imagePath}`;
};

export default function CategoryCardFetch() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/store/categories/`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        setCategories(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Handle category click
  const handleCategoryClick = (categoryId: number) => {
    router.push(`/ShopPage?category=${categoryId}`);
  };

  if (loading) {
    return (
      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, idx) => (
          <div key={idx} className="animate-pulse w-full h-64 bg-gray-200 rounded-xl"></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        Failed to load categories: {error}
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No categories found.
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center border-b-2">
        <h2 className="text-2xl font-bold text-gray-500 p-8">Store Categories</h2>
        <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {categories.length} {categories.length === 1 ? 'category' : 'categories'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => {
          const imageUrl = getImageUrl(category.cat_thumbnail);
          return (
            <CategoryCard
              key={category.id}
              image={imageUrl}
              title={category.name}
              onClick={() => handleCategoryClick(category.id)}
            />
          );
        })}
      </div>
    </div>
  );
}
