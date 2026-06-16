import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Clothes() {
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [gender, setGender] = useState("all");

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter(
          (p) => p.category?.toLowerCase() === "clothes"
        );
        setClothes(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const displayed = clothes
    .filter((p) => p.name?.toLowerCase().includes(search.toLowerCase()))
    .filter((p) => {
      if (gender === "all") return true;
      const isMen =
        p.gender?.toLowerCase() === "men" ||
        p.name?.toLowerCase().includes("men") ||
        p.name?.toLowerCase().includes("male");
      if (gender === "men") return isMen;
      if (gender === "women") return !isMen;
      return true;
    })
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
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-purple-700">Clothes</h1>
          <p className="text-stone-500 text-sm mt-1">
            {clothes.length > 0 ? `${displayed.length} item${displayed.length !== 1 ? "s" : ""}` : "Fresh styles for every occasion"}
          </p>
        </div>

        {/* Gender filter pills */}
        {!loading && clothes.length > 0 && (
          <div className="flex gap-2 mb-6">
            {["all", "men", "women"].map((g) => (
              <button
                key={g}
                onClick={() => setGender(g)}
                className={`px-5 py-2 rounded-full text-sm font-medium border transition-all ${
                  gender === g
                    ? "bg-stone-900 text-white border-stone-900"
                    : "bg-white text-stone-600 border-stone-200 hover:border-stone-400"
                }`}
              >
                {g === "all" ? "All" : g === "men" ? "Men" : "Women"}
              </button>
            ))}
          </div>
        )}

        {/* Search + Sort bar */}
        {!loading && clothes.length > 0 && (
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
                placeholder="Search clothes…"
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
            <p className="text-sm text-stone-400">Loading clothes…</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && clothes.length === 0 && (
          <div className="text-center py-32">
            <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M7 21h10M12 21V11m0 0l-3-3m3 3l3-3M5 8V6a1 1 0 011-1h2l1-2h6l1 2h2a1 1 0 011 1v2" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-stone-700 mb-1">No clothes yet</h3>
            <p className="text-sm text-stone-400">New arrivals are on their way — check back soon.</p>
          </div>
        )}

        {/* No search/filter results */}
        {!loading && clothes.length > 0 && displayed.length === 0 && (
          <div className="text-center py-20">
            <p className="text-stone-500 text-sm">
              No results{search ? ` for "${search}"` : ""}{gender !== "all" ? ` in ${gender === "men" ? "Men's" : "Women's"}` : ""}
            </p>
            <button
              onClick={() => { setSearch(""); setGender("all"); }}
              className="mt-3 text-sm text-violet-700 font-medium hover:underline"
            >
              Clear filters
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
                <div className="relative aspect-[3/4] overflow-hidden bg-stone-100">
                  <img
                    src={product.image_url || product.image || "https://via.placeholder.com/300x400?text=No+Image"}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => (e.target.src = "https://via.placeholder.com/300x400?text=Image+Error")}
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
                  <h2 className="text-sm font-semibold text-stone-800 line-clamp-2 group-hover:text-violet-700 transition-colors leading-snug">
                    {product.name}
                  </h2>
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