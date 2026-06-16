import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
      
        const response = await fetch("http://localhost:5000/products");

        if (!response.ok) {
          throw new Error(`HTTP ${response.status} – ${response.statusText}`);
        }

        const data = await response.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Products fetch failed:", err);
        setError("Failed to load products: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  
  const filteredProducts = products.filter((p) =>
    (p.name || "").toLowerCase().includes(query.toLowerCase())
  );

  if (loading) {
    return <div className="text-center py-10">Loading products...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">{error}</div>;
  }

  return (
    <div className="max-w-[1440px] mx-auto px-8 py-10">
      <h1 className="text-2xl font-bold text-purple-700 mb-6">
        Search results for "{query}"
      </h1>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-600">
          No products found for "{query}". Try something else.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Link key={product.id} to={`/product/${product.id}`}>
              <ProductCard product={product} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}