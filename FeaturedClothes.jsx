import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

export default function FeaturedClothes() {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => {
        console.log("All products (FeaturedClothes):", data);
        const filtered = data.filter(
          (item) => item.category?.toLowerCase() === "clothes")
          .slice(0, 5); // Get first 5 clothes items
        
        console.log("Filtered clothes:", filtered);
        setClothes(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-purple-700 mb-2">
            Featured Clothing
          </h2>
          <p className="text-lg text-gray-600">
            Discover the latest trends in fashion
          </p>
        </div>

        {loading ? (
          <p className="text-center text-gray-600 py-10">Loading clothes...</p>
        ) : clothes.length === 0 ? (
          <p className="text-center text-gray-600 py-10">
            No featured clothing available yet
          </p>
        ) : (
          <div className="flex flex-wrap gap-6 justify-center">
            {clothes.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  ...product,
                  image: product.image_url,
                  arSupported: product.ar_supported,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}