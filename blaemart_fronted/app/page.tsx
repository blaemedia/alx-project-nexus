// import Image from "next/image";
import Hero from "@/components/Hero/Hero";
import CategoryCard from "@/components/Cards/CategoryCard"
import NavBar from "@/components/NavBar/NavBar";
export default function Home() {
  return (
    <>

     
          <NavBar/>
          <Hero/>
          <div className='p-10 grid grid-rows-1 grid-flow-col gap-6 justify-center'>
            <CategoryCard/>
            <CategoryCard/>
            <CategoryCard/>
            <CategoryCard/>
        </div> 
     
    </>
   
  );
}
