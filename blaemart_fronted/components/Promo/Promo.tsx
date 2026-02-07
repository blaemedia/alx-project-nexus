import React from 'react'
import Image from 'next/image'
import { useState, useEffect } from 'react';



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
  
export default function Promo() {


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

            const result = await res.json()
           
          setData(result);
          }

          
        
        } catch (err) {
          console.error('Fetch error details:', err);
          setError(`Failed to connect to API: ${err instanceof Error ? err.message : 'Unknown error'}`);
        } finally {
          setLoading(false);
        }
      };
  
      fetchCategories();
    }, []);
  
    if (loading) return <p>Loading...</p>; if (error) return <p>Error: {error}</p>;

  return (
   
    <>

    <div className="flex flex-row h-160 w-full ">
        <div className="bg-[#FF8D28] h-full w-160">
            {data.map(item => ( <div key={item.id}>{item.name}</div> ))}
        </div>
        <div className="bg-[amber-300] h-full w-160">
            <Image src='/images/pngwing-4.png'
            alt=""
            width = "5000"
              height ="1000"
            
            
            />
        </div>
    </div>
 

    
    </>
  )
}
