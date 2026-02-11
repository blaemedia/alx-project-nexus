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

// Updated getImageUrl function with all categories
const getBackendImageUrl = (imagePath: string): string | null => {
  if (!imagePath || imagePath.trim() === '') {
    return null;
  }
  
  // Handle different formats of imagePath
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath; // Already a full URL
  }
  
  if (imagePath.startsWith('/')) {
    return `${API_BASE_URL}${imagePath}`;
  }
  
  // Default - assume it's relative to API base
  return `${API_BASE_URL}/${imagePath}`;
};

// Fallback Unsplash images
const getFallbackImage = (categoryName: string): string => {
  const imageMap: Record<string, string> = {
    'groceries': 'https://images.unsplash.com/photo-1542838132-92c53300491e',
    'electronics': 'https://images.unsplash.com/photo-1498049794561-7780e7231661',
    'footwear': 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2',
    'home & living': 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4',
    'kitchen': 'https://images.pexels.com/photos-9475353/pexels-photo-9475353.jpeg',
    "men's fashion": 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b',
    "women's fashion": 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d',
    'beauty products': 'https://images.unsplash.com/photo-1596462502278-27bfdc403348',
    'accessories': 'https://images.unsplash.com/photo-1594223274512-ad4803739b7c',
    'kids & baby': 'https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d',
    'sports & fitness': 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48',
    'default': 'https://images.unsplash.com/photo-1542838132-92c53300491e'
  };

  const lowerName = categoryName.toLowerCase().trim();
  
  // Try exact match first
  if (imageMap[lowerName]) {
    return `${imageMap[lowerName]}?w=400&h=300&fit=crop&auto=format`;
  }
  
  // Try partial matches
  for (const [key, url] of Object.entries(imageMap)) {
    if (lowerName.includes(key) && key !== 'default') {
      return `${url}?w=400&h=300&fit=crop&auto=format`;
    }
  }
  
  // Default fallback
  return `${imageMap.default}?w=400&h=300&fit=crop&auto=format`;
};

// Main function - tries backend first, falls back if needed
const getImageUrl = (imagePath: string, categoryName: string): string => {
  const backendUrl = getBackendImageUrl(imagePath);
  
  if (backendUrl) {
    console.log(`🔄 Trying backend image: ${backendUrl}`);
    return backendUrl;
  }
  
  console.log(`⚡ Using fallback image for: ${categoryName}`);
  return getFallbackImage(categoryName);
};

export default function CategoryCardFetch() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const url = `${API_BASE_URL}/store/categories/`;
        console.log('🔄 Fetching from URL:', url);
        
        // Add timeout and better headers
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(url, {
          signal: controller.signal,
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors', // Explicitly set
          credentials: 'omit', // Try 'omit' first, then 'include' if needed
        });
        
        clearTimeout(timeoutId);
        
        console.log('📊 Response Status:', response.status, response.statusText);
        console.log('📊 Response Headers:', Object.fromEntries(response.headers.entries()));
        
        // Check if response is JSON
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('❌ Response is not JSON:', text.substring(0, 500));
          throw new Error(`Expected JSON but got: ${contentType}`);
        }
        
        const data = await response.json();
        console.log('✅ Success! Data received:', data);
        
        if (Array.isArray(data)) {
          setCategories(data);
        } else if (data.results || data.items) {
          // Handle paginated responses
          setCategories(data.results || data.items || []);
        } else {
          console.error('❌ Unexpected data format:', data);
          setCategories([]);
        }
        
      } catch (error: unknown) {
        console.error('💥 Fetch error details:');
        
        // Type-safe error handling
        if (error instanceof Error) {
          console.error('- Error name:', error.name);
          console.error('- Error message:', error.message);
          console.error('- Error type:', error.constructor.name);
          
          if (error.name === 'AbortError') {
            setError('Request timeout. Check if Django server is running.');
          } else if (error.name === 'TypeError') {
            setError('Network error. Check CORS and server connection.');
          } else {
            setError(error.message || 'Failed to fetch categories');
          }
        } else if (typeof error === 'string') {
          console.error('- String error:', error);
          setError(error);
        } else {
          console.error('- Unknown error:', error);
          setError('An unknown error occurred');
        }
        
        // Set empty array for fallback
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

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
        <div className="mt-4 text-sm text-gray-500">
          <p>Please check:</p>
          <ul className="list-disc list-inside mt-2">
            <li>Is Django server running? (python manage.py runserver)</li>
            <li>Check browser console for detailed error logs</li>
            <li>Test endpoint directly: http://127.0.0.1:8000/store/categories/</li>
          </ul>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No categories found.
        <p className="mt-2 text-sm">The API returned an empty list.</p>
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
          const imageUrl = getImageUrl(category.cat_thumbnail, category.name);
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