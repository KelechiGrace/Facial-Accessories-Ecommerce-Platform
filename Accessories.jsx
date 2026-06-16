import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Accessories() {
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (item) => item.category?.toLowerCase() === "accessories"
        );
        setAccessories(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading accessories:", err);
        setLoading(false);
      });
  }, []);

  const displayed = accessories
    .filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-purple-700">Accessories</h1>
          <p className="text-stone-500 text-sm mt-1">
            {accessories.length > 0 ? `${accessories.length} items` : "Curated pieces to complete your look"}
          </p>
        </div>

        {/* Search + Sort bar */}
        {!loading && accessories.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-8">
            <div className="relative flex-1">
              <svg
                className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400"
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search accessories…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-stone-200 bg-white text-stone-900 placeholder-stone-400 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 text-sm rounded-xl border border-stone-200 bg-white text-stone-700 outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all cursor-pointer"
            >
              <option value="default">Sort: Featured</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="name">Name: A–Z</option>
            </select>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32 gap-3">
            <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
            <p className="text-sm text-stone-400">Loading accessories…</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && accessories.length === 0 && (
          <div className="text-center py-32">
            <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-stone-700 mb-1">No accessories yet</h3>
            <p className="text-sm text-stone-400">Check back soon — new pieces are on their way.</p>
          </div>
        )}

        {/* No search results */}
        {!loading && accessories.length > 0 && displayed.length === 0 && (
          <div className="text-center py-20">
            <p className="text-stone-500 text-sm">No results for "<span className="font-medium">{search}</span>"</p>
            <button
              onClick={() => setSearch("")}
              className="mt-3 text-sm text-violet-700 font-medium hover:underline"
            >
              Clear search
            </button>
          </div>
        )}

        {/* Product grid */}
        {!loading && displayed.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {displayed.map((product) => (
              <Link
                key={product.id}
                to={`/product/${product.id}`}
                className="group bg-white rounded-2xl border border-stone-200 overflow-hidden hover:border-stone-300 hover:shadow-md transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-square overflow-hidden bg-stone-100">
                  <img
                    src={product.image_url || "https://via.placeholder.com/400x400?text=No+Image"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/400?text=Image+Error")}
                  />
                  {product.ar_supported === 1 && (
                    <div className="absolute top-2.5 left-2.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-100 text-violet-800 text-xs font-medium rounded-full border border-violet-200">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                        </svg>
                        Try-On
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-stone-800 line-clamp-2 group-hover:text-violet-700 transition-colors leading-snug">
                    {product.name}
                  </h3>
                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-base font-bold text-emerald-700">
                      ₦{Number(product.price).toLocaleString()}
                    </p>
                    <span className="w-7 h-7 flex items-center justify-center rounded-full bg-stone-100 group-hover:bg-violet-100 transition-colors">
                      <svg className="w-3.5 h-3.5 text-stone-500 group-hover:text-violet-700 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}