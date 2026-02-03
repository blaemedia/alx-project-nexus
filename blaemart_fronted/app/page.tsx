'use client'


import Hero from "@/components/Hero/Hero";
import CategoryDataFetch from "@/components/Cards/CategoryCard";
import Promo from "@/components/Cards/CategoryCard";
import NavBar from "@/components/NavBar/NavBar";
import Footer from "@/components/Footer/Footer";
import React from "react";


  



export default function Home() {
  


  return (
    <>
      <NavBar />
      <Hero />


   

      <CategoryDataFetch/>

      <Promo/>

      <Footer/>

    </>
  );
}