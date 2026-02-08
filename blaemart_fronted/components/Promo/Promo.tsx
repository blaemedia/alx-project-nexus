"use client";

import React, { useEffect, useState } from "react";

interface Promo {
  id: number;
  title: string;
  description?: string;
  is_active: boolean;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export default function Promo() {
  const [promo, setPromo] = useState<Promo | null>(null);

  useEffect(() => {
    const fetchPromo = async () => {
      const res = await fetch(
        "http://127.0.0.1:8000/store/promotions/",
        { headers: { accept: "application/json" } }
      );

      if (!res.ok) return;

      const data: PaginatedResponse<Promo> = await res.json();

      // ✅ THIS IS THE FIX
      const activePromos = data.results.filter(
        (p) => p.is_active === true
      );

      if (activePromos.length > 0) {
        setPromo(activePromos[0]);
      }
    };

    fetchPromo();
  }, []);

  if (!promo) return null;

  return (
    <div className="bg-[#FF4400] text-white text-center p-4">
      <h2 className="font-bold">{promo.title}</h2>
      {promo.description && (
        <p className="text-sm mt-1">{promo.description}</p>
      )}
    </div>
  );
}
