import React from "react";
import Image from "next/image";

interface CardProps {
  title?: string;
  description?: string;
  imageSrc?: string;
}

export default function ProductCard({
  title = "Awesome Product",
  description = "This is a short description of the product or item.",
  imageSrc = "/images/pngwing-3.png",
}: CardProps) {
  return (
    <div className="max-w-sm bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      
      {/* Image */}
      <div className="relative h-64 w-full">
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-contain p-4"
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-700 mb-4">{description}</p>

        {/* Buttons / Icons */}
        <div className="flex justify-between items-center">
          <button className="bg-[#FF383C] text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
            Buy Now
          </button>
          <span className="text-green-500 font-bold text-lg">⭐ 4.5</span>
        </div>
      </div>
    </div>
  );
}
