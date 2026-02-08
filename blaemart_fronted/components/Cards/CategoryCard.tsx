'use client';

import Image from 'next/image';
import { useState } from 'react';

interface CategoryCardProps {
  image?: string;
  title?: string;
  onClick?: () => void; // ✅ Add this
}

export default function CategoryCard({
  image = "/images/default.png",
  title = "Default Title",
  onClick, // ✅ Receive click prop
}: CategoryCardProps) {
  const [imgSrc, setImgSrc] = useState(image);

  const handleError = () => {
    console.log('Image failed to load:', image);
    setImgSrc('/images/default.png');
  };

  return (
    <div
      className="w-72 h-64 bg-white flex flex-col rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden cursor-pointer"
      onClick={onClick} // ✅ Attach click handler here
    >
      <div className="relative w-full h-48">
        <Image
          src={imgSrc}
          alt={title}
          fill
          className="object-cover hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={handleError}
          priority={false}
        />
      </div>

      {/* Text below */}
      <div className="p-3 grow flex items-center justify-center">
        <p className="text-2xl font-bold text-gray-400 text-center truncate w-full">
          {title}
        </p>
      </div>
    </div>
  );
}
