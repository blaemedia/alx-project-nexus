import React from 'react'
import Image from 'next/image'

 interface CategoryCardProps {
  image?: string; // optional with default
  title?: string; // optional with default
}

export default function CategoryCard(
  {
    image="/images/default.png",
    title="Default Title"
  }:
  
  CategoryCardProps): React.ReactElement {
  
  return (
    <div className="w-76 h-64 bg-gray-200 flex flex-col 
    rounded-xl shadow-2xl hover: resize">
  {/* Image container */}
  <div className="relative w-68 mx-auto mt-3 rounded-md bg-gray-100 h-100">
    <Image
      src={image}
      alt={title}
      fill
      className="object-cover scale-100"
      priority
    />
  </div>

  {/* Text below */}
  <p className="text-2xl font-extrabold text-gray-400 p-2">
    {title}
  </p>
</div>

  )
}
