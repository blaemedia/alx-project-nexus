'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';

interface PromoData {
  id: number;
  name: string;
  discount_percent: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

const Promo: React.FC = () => {
  const [promo, setPromo] = useState<PromoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPromo = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/store/promotions/');
        if (!response.ok) throw new Error('Failed to fetch promotions');

        const data: PromoData[] = await response.json();

        // get first active promo (or you can sort by date)
        const activePromos = data.filter((p) => p.is_active);

        if (activePromos.length === 1) {
        throw new Error('No active promotions');
        }

        // index safely
        const activePromo = activePromos[1] || activePromos[0];

        setPromo(activePromo);
       

        if (!activePromo) {
          throw new Error('No active promotion');
        }

        setPromo(activePromo);
      } catch (err) {
        console.error(err);
        setError('Failed to load promotion');
      } finally {
        setLoading(false);
      }
    };

    fetchPromo();
  }, []);

  if (loading) return <div className="text-center p-10">Loading...</div>;
  if (error) return <div className="text-center p-10 text-red-500">{error}</div>;
  if (!promo) return null;

  return (
    <section className="w-full overflow-hidden shadow-lg bg-gray-900 text-white">
      <div className="relative h-64 md:h-50 w-full">
        {/* Background image */}
        <Image
          src="/images/Fashion.jpg"
          alt="Promotion Banner"
          fill
          priority
          className="object-cover object-[0%_15%]"
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50 flex items-center">
          <div className="px-6 md:px-12 max-w-xl">
            <span className="inline-block bg-red-500 text-white text-sm px-3 py-1 rounded-full mb-3">
              Limited Offer
            </span>

            <h2 className="text-2xl md:text-4xl font-bold mb-2">
              {promo.name}
            </h2>

            <p className="text-lg md:text-xl text-red-400 font-semibold mb-3">
              {promo.discount_percent}% OFF
            </p>

            <p className="text-sm text-gray-200">
              {new Date(promo.start_date).toLocaleDateString()} –{' '}
              {new Date(promo.end_date).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Promo;
