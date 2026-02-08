"use client";

import React from "react";
import Image from "next/image";

export interface CardProps {
  title?: string;
  description?: string;
  imageSrc?: string;
  rating?: number;
  onBuy?: () => void;
}

const ProductCard: React.FC<CardProps> = ({
  title = "Awesome Product",
  description = "This is a short description of the product or item.",
  imageSrc = "/images/pngwing-3.png",
  rating = 4.5,
  onBuy,
}) => {
  return (
    <div className="max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      
      {/* IMAGE */}
      <div className="relative h-64 w-full rounded-t-2xl overflow-hidden bg-gray-100">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover p-2"
          sizes="(max-width: 768px) 100vw, 300px"
          onError={(e) => {
            // fallback to placeholder
            (e.target as HTMLImageElement).src = "/images/pngwing-3.png";

          }}
        />
      </div>

      {/* CONTENT */}
      <div className="p-6">
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <p className="text-gray-700 mb-4">{description}</p>

        <div className="flex justify-between items-center gap-3">
          <button
            onClick={onBuy}
            className="flex-1 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Buy Now
          </button>
          <span className="text-[#FF4400] font-bold text-lg">⭐ {rating}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
