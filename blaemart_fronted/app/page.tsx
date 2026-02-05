

import Hero from "@/components/Hero/Hero";
import CategoryCardFetch from "@/components/Cards/CategoryCardFetch";
import NavBar from "@/components/NavBar/NavBar";
import Promo from "@/components/Cards/Promo";
import Footer from "@/components/Cards/Footer";
import React from "react";
import BestSelling from "@/components/Cards/BestSelling";


export default function Home() {

  return (
    <>
    
          <NavBar/>
           <Promo/>
          <Hero/>
          <CategoryCardFetch/>
          <div>

      
           <p className="py-8 text-gray-500 text-2xl font-bold border-b-2">Best Selling </p>
          <BestSelling />
              </div>
          <Footer/>
     
    </>

  );
}