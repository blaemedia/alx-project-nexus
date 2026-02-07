// components/NewArrivals.tsx
"use client";

import Image from "next/image";

const NewArrivals: React.FC = () => {
  return (
    <section className="max-w-9xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center gap-8 bg-gray-100">
      
      {/* Left Column */}
      <div className="flex flex-col gap-6 md:w-1/2">
        {/* Flex Item 1 */}
        {/* <div className="bg-gray-100 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold">Fresh Fashion</h2>
          <p className="text-gray-600">
            Check out our latest trends for this season. Limited stock available!
          </p>
        </div> */}

        {/* Flex Item 2 */}
        <div className="bg-[#FF8D28] p-6 rounded-lg shadow">
          <h2 className="text-7xl font-bold">Super Turbo Washing Machine</h2>
          <p className="text-gray-600">
            Discover the newest gadgets and devices at unbeatable prices.
          </p>
        </div>
      </div>

      {/* Right Column */}
      <div className="md:w-1/2 flex justify-center bo">
        <Image
          src="/images/pngwing-4.png" // replace with your image path
          alt="New Arrivals"
          width={600}
          height={600}
          className="rounded-lg object-cover"
        />
      </div>
    </section>
  );
};

export default NewArrivals;
