"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  message: string;
  rating: number;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "Aisha O.",
    message:
      "Great quality products and fast delivery. I’ll definitely shop here again!",
    rating: 5,
  },
  {
    id: 2,
    name: "Daniel K.",
    message:
      "Customer support was very responsive and helpful. Smooth shopping experience.",
    rating: 4,
  },
  {
    id: 3,
    name: "Chinedu M.",
    message:
      "Affordable prices and the products matched exactly what was shown online.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="w-full py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-10">
          What Our Customers Say
        </h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((item) => (
            <Card
              key={item.id}
              className="rounded-2xl shadow-sm hover:shadow-md transition"
            >
              <CardContent className="p-6">
                <div className="flex items-center mb-3">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`h-4 w-4 ${
                        index < item.rating
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                      fill={index < item.rating ? "currentColor" : "none"}
                    />
                  ))}
                </div>

                <p className="text-gray-600 mb-4">“{item.message}”</p>
                <span className="font-semibold text-gray-900">
                  {item.name}
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
