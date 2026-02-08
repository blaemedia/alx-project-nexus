

import Hero from "@/components/Hero/Hero";
import CategoryCardFetch from "@/components/Cards/CategoryCardFetch";


import Footer from "@/components/Cards/Footer";
import NewArrivals from "@/components/NewArrivals";
import Testimonials from "@/components/Testimonial";
import React from "react";
import BestSelling from "@/components/Cards/BestSelling";


export default function Home() {

  return (
    <>
    
          
          
          <Hero/>
          <CategoryCardFetch/>
          <div>
           <p className="py-4 text-gray-500 text-2xl font-bold border-b-2">Best Selling </p>
           <div className="py-8">
              <BestSelling  />
           </div>
          
          </div>

        <div className="py-12 border-b-4">
           <p className="py-8 text-gray-500 text-2xl font-bold border-b-2">New Arrival</p>
        <NewArrivals/>
        </div>
        <Testimonials/>

        
          <Footer/>
     
    </>

  );
}