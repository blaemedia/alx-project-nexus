import React from "react";
import Image from "next/image";

export interface CardProps {
  title?: string;
  description?: string;
  imageSrc?: string;
  rating?: number; // optional, in case you want dynamic ratings
}

const ProductCard: React.FC<CardProps> = ({
  title = "Awesome Product",
  description = "This is a short description of the product or item.",
  imageSrc = "/images/pngwing-3.png",
  rating = 4.5,
}) => {
  return (
    <div className="max-w-sm bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <div className="relative h-64 w-full">
        <Image src={imageSrc} alt={title} fill className="object-contain p-4" />
      </div>
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">{title}</h2>
        <p className="text-gray-700 mb-4">{description}</p>
        <div className="flex justify-between items-center">
          <button className="w-full bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors">
            Buy Now
          </button>
          <span className="text-green-500 font-bold text-lg">⭐ {rating}</span>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
