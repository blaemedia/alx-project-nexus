import React from 'react'
import Image from 'next/image'


export default function Hero() {
  return (
    <>
            <div className='position: relative h-160 width-500 bg-[#FF383C] rounded-b-4xl'>
            <h1 className='text-center font-extrabold text-7xl p-8 text-[#D0FF00]'>Buy Better.  Spend Less.</h1>
            <div className='flex justify-center text-2xl font-medium text-white'>
              <p>✅ Secure Payments</p>
              <p>🚚 Fast Delivery</p>
              <p>🔄 Easy Returns</p>
            </div> <Image src='/images/pngwing-3.png' alt=''
              // width = "5000"
              // height ="1000"
              fill
              className="object-contain object-[50%_70%] scale-130"
              priority
              />
             
        </div>
    </>
  )
}
