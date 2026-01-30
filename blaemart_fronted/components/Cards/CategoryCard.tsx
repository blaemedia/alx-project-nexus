import React from 'react'
import Image from 'next/image'
export default function CategoryCard() {
  return (
    <div className="w-76 h-64 bg-gray-200 flex flex-col 
    rounded-xl shadow-2xl hover: resize">
  {/* Image container */}
  <div className="relative w-68 mx-auto mt-3 rounded-md bg-gray-100 h-100">
    <Image
      src="/images/Fashion.jpg"
      alt="Fashion"
      fill
      className="object-cover scale-100"
      priority
    />
  </div>

  {/* Text below */}
  <p className="text-2xl font-extrabold text-gray-400 p-2">
    Fashion
  </p>
</div>

  )
}
