

import Hero from "@/components/Hero/Hero";
import CategoryCardFetch from "@/components/Cards/CategoryCardFetch";
import NavBar from "@/components/NavBar/NavBar";
import Promo from "@/components/Cards/Promo";
import Footer from "@/components/Cards/Footer";
import React from "react";


export default function Home() {

  return (
    <>
    
          <NavBar/>
           <Promo/>
          <Hero/>
          <CategoryCardFetch/>
         
          <Footer/>
     
    </>

  );
}