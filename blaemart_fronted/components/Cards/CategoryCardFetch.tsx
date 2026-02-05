'use client';

import React from 'react';
import { useEffect, useState } from 'react';
import CategoryCard from './CategoryCard';

interface Category {
  id: number;
  name: string;  // Changed from title to name
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

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        console.log('Fetching categories from API...');
        
        const response = await fetch('http://127.0.0.1:8000/store/categories/', {
          headers: {
            Accept: 'application/json',
          },
        });
        
        console.log('API Response status:', response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error response:', errorText);
          throw new Error(`HTTP ${response.status}: ${errorText.slice(0, 100)}`);
        }
        
        const data = await response.json();
        console.log('Fetched categories data:', data);
        
        if (data.length > 0) {
          console.log('First category structure:', data[0]);
          console.log('Available keys:', Object.keys(data[0]));
        }
        
        setCategories(data);
      } catch (err) {
        console.error('Fetch error details:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="w-full h-64 bg-gray-200 rounded-xl">
                <div className="w-11/12 h-40 mx-auto mt-3 bg-gray-300 rounded-md"></div>
                <div className="h-6 bg-gray-300 rounded mx-4 mt-4"></div>
                <div className="h-4 bg-gray-300 rounded mx-4 mt-2 w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
          <h3 className="text-red-800 font-semibold text-lg mb-2">Failed to Load Categories</h3>
          <p className="text-red-600 bg-red-100 p-2 rounded">{error}</p>
          
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <h4 className="font-semibold text-gray-700 mb-2">Troubleshooting steps:</h4>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-600">
              <li>Check if Django server is running: <code>http://127.0.0.1:8000</code></li>
              <li>Test API endpoint directly: 
                <a 
                  href="http://127.0.0.1:8000/store/categories/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline ml-1"
                >
                  Open in new tab
                </a>
              </li>
              <li>Check browser console for CORS errors</li>
              <li>Verify Django CORS headers are configured</li>
            </ol>
          </div>
          
          <div className="mt-4 flex gap-2">
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
            <button 
              onClick={() => fetch('http://127.0.0.1:8000/store/categories/')
                .then(r => r.json())
                .then(console.log)
                .catch(console.error)}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Test API in Console
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="p-4">
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📂</div>
          <h3 className="text-xl font-semibold text-gray-600">No Categories Found</h3>
          <p className="text-gray-500 mt-2">The store doesn&apos;t have any categories yet.</p>
          <p className="text-gray-400 text-sm mt-1">Check Django admin to add categories.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Store Categories</h2>
        <span className="text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          {categories.length} {categories.length === 1 ? 'category' : 'categories'}
        </span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => {
          const imageUrl = getImageUrl(category.cat_thumbnail);
          
          console.log(`Rendering category ${category.id}:`, {
            name: category.name,  // Changed from title to name
            cat_thumbnail: category.cat_thumbnail,
            imageUrl: imageUrl
          });
          
          return (
            <CategoryCard
              key={category.id}
              image={imageUrl}
              title={category.name || 'Untitled Category'}  // Changed from title to name
            />
          );
        })}
      </div>
     
    </div>
  );
}