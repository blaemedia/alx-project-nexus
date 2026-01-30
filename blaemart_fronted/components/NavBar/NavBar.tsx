"use client"
import React from 'react'
import Link from 'next/link'
import SearchBar from '../SearchBar'

export default function NavBar() {

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };

  return (
    <>

     <div className='bg-gray-100 flex gap-1 justify-center mx-auto p-10 items-center'>

        <div className='text-[#FF4400] text-4xl font-bold'>
            <p>Blae|Mart</p>
        </div>

        <SearchBar onSearch={handleSearch}/>
    
          <nav className=' text-gray-500  text-2xl space-x-4'>
            <Link href="">
                  Home
            </Link>

            <Link href="">
                    Shop
            </Link>

            <Link href="">
                    About Us
            </Link>

            <button className='bg-gray-300 px-4 py-1 rounded-xl border-2 border-gray-200'>Sign In</button>

          </nav>

      </div> 
    </>
  )
}
