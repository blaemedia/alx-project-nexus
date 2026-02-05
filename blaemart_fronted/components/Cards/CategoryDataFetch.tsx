import React from 'react'
import { useState, useEffect } from 'react';
import CategoryCard from "@/components/Cards/CategoryCard";
import Image from "next/image";
 // Update the interface to match your Django API response
  interface ApiCategory {
    id: number;
    name: string;
    slug: string;
    description: string;
    is_active: boolean;
    cat_thumbnail: string | null;
    image_url?: string;
  }
  
  // Interface for processed data with image property
  interface Category extends ApiCategory {
    image: string;
  }
  
 

export default function CategoryDataFetch() {
 const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        console.log('Attempting to fetch from:', 'http://127.0.0.1:8000/store/categories/');
        
        const res = await fetch("http://127.0.0.1:8000/store/categories/", {
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          cache: 'no-cache',
        });

        console.log('Response status:', res.status);
        
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Response error text:', errorText);
          throw new Error(`API Error: ${res.status} ${res.statusText}`);
        }

        const apiData: ApiCategory[] = await res.json();
        console.log('Raw API data received:', apiData);
        
        // Debug: Check what fields we have
        if (apiData.length > 0) {
          const firstItem = apiData[0];
          console.log('First item keys:', Object.keys(firstItem));
          console.log('First item cat_thumbnail:', firstItem.cat_thumbnail);
          console.log('First item image_url:', firstItem.image_url);
        }
        
        // Process the data to add the image property
        const processedData: Category[] = apiData.map((cat, index) => {
          let imageUrl = '/images/default.png';
          
          // Priority 1: Use image_url from Django serializer (full URL)
          if (cat.image_url) {
            imageUrl = cat.image_url;
          }
          // Priority 2: Use cat_thumbnail field (relative path)
          else if (cat.cat_thumbnail) {
            // Ensure the path starts with /media/
            const thumb = cat.cat_thumbnail.startsWith('/') 
              ? cat.cat_thumbnail 
              : `/${cat.cat_thumbnail}`;
            imageUrl = `http://127.0.0.1:8000${thumb}`;
          }
          // Priority 3: Use placeholder images if no image from API
          else {
            // Use Unsplash placeholder images
            const placeholderImages = [
              'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=300&h=200&fit=crop',
              'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=200&fit=crop',
              'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=300&h=200&fit=crop',
              'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=300&h=200&fit=crop',
              'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop',
            ];
            imageUrl = placeholderImages[index % placeholderImages.length];
          }
          
          // Return the processed category with image property
          return {
            ...cat,
            image: imageUrl
          };
        });
        
        console.log('Processed data:', processedData);
        setData(processedData);
      } catch (err) {
        console.error('Fetch error details:', err);
        setError(`Failed to connect to API: ${err instanceof Error ? err.message : 'Unknown error'}`);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);


  return (
    <div>
       {loading && (
              <div className="text-center p-10">Loading categories...</div>
            )}
      
            {error && (
              <div className="text-center p-10 text-red-500">{error}</div>
            )}
               <div className='pt-12 pb-4 text-gray-400 border-b-2'>
                  <h1 className='font-bold text-3xl'>Categories</h1>
              </div>
      
      
            
            {!loading && !error && (
             
              
              <div className="p-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 
              lg:grid-cols-4 gap-6 gap-x-24 bg-gray-50 items-center justify-items-center">
                
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
      
    </div>
  )
}
