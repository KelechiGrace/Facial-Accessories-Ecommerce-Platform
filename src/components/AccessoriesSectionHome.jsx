import React, { useEffect, useState } from "react";
import ProductCard from "./ProductCard";

export default function AccessoriesSectionHome() {
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => {
        console.log("All products (AccessoriesHome):", data);
        const filtered = data.filter(
          (item) => item.category?.toLowerCase() === "accessories")
        .slice(0, 5); // Get first 5 accessories items
        
        console.log("Filtered accessories:", filtered);
        setAccessories(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setLoading(false);
      });
  }, []);

  return (
    <section className="bg-white py-16">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="mb-10">
          <h2 className="text-3xl font-semibold text-purple-700">
            Try Accessories Using Augmented Reality
          </h2>
          <p className="text-gray-600 mt-2">
            Experience products virtually before purchasing!
          </p>
        </div>

        {loading ? (
          <p className="text-center text-gray-600 py-10">Loading accessories...</p>
        ) : accessories.length === 0 ? (
          <p className="text-center text-gray-600 py-10">
            No accessories available yet
          </p>
        ) : (
          <div className="flex flex-wrap gap-6 justify-center">
            {accessories.map((product) => (
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