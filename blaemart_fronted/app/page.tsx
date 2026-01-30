// import Image from "next/image";
import {useState,useEffect} from 'react'
import Hero from "@/components/Hero/Hero";
// import CategoryCard from "@/components/Cards/CategoryCard"
import NavBar from "@/components/NavBar/NavBar";
import React from "react";
export default function Home() {

  const [DataStr,setDataStr]=useState('')

  useEffect(
    fetch()
  )
  return (
    <>

     
          <NavBar/>
          <Hero/>

          <div className='p-10 grid grid-rows-1 grid-flow-col gap-6 justify-center'>
            {/* <CategoryCard/> */}
           
        </div> 
     
    </>
   
  );
}
