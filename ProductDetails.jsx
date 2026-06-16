import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const SIZES = ["XS", "S", "M", "L", "XL"];

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:5000/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Product not found (status ${res.status})`);
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handleAR = () => {
    if (!product?.id) return;
    navigate(`/ar-tryon/${product.id}`, { state: { product } });
  };

  const handleAddToCart = async () => {
  const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingProduct = existingCart.find((item) => item.id === product.id);
  if (existingProduct) {
    existingProduct.quantity += 1;
  } else {
    existingCart.push({ ...product, quantity: 1 });
  }
  localStorage.setItem("cart", JSON.stringify(existingCart));

  try {
    await fetch("http://localhost:5000/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_id: product.id, quantity: 1 }),
    });
  } catch (err) {
    console.error("Failed to save cart to DB:", err);
  }

  setAddedToCart(true);
  setTimeout(() => setAddedToCart(false), 2000);
};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-stone-300 border-t-stone-800 rounded-full animate-spin" />
          <p className="text-sm text-stone-500 tracking-wide">Loading product…</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-stone-50">
        <div className="max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-stone-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-stone-800 mb-2">Product not found</h2>
          <p className="text-stone-500 text-sm mb-6">{error || "The requested product could not be loaded."}</p>
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 bg-stone-900 text-white text-sm font-medium rounded-xl hover:bg-stone-800 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const isClothing = product.category?.toLowerCase().includes("cloth") ||
    product.category?.toLowerCase().includes("fashion") ||
    product.category?.toLowerCase().includes("wear") ||
    product.category?.toLowerCase().includes("apparel");

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">

        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-8 inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-800 transition-colors group"
        >
          <svg className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

          {/* ── LEFT: Image + Tips ── */}
          <div className="flex flex-col gap-4">

            {/* Product image */}
            <div className="relative rounded-2xl overflow-hidden bg-stone-100 border border-stone-200">
              <img
                src={product.image_url || "https://via.placeholder.com/600x800?text=No+Image"}
                alt={product.name || "Product image"}
                className="w-full object-cover max-h-[580px]"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/600x800?text=Image+Not+Found";
                }}
              />

              {/* Badges on image */}
              <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
                {product.ar_supported === 1 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-violet-100 text-violet-800 border border-violet-200">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    AR Ready
                  </span>
                )}
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 border border-emerald-200">
                  In Stock
                </span>
              </div>
            </div>

            {/* Styling Tip */}
            {product.stylingTip && (
              <div className="rounded-xl bg-violet-50 border border-violet-100 px-4 py-3.5">
                <p className="text-xs font-semibold text-violet-700 mb-1 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Styling tip
                </p>
                <p className="text-sm text-violet-700 leading-relaxed">{product.stylingTip}</p>
              </div>
            )}

            {/* AR Tip */}
            {product.ar_supported === 1 && (
              <div className="rounded-xl bg-sky-50 border border-sky-100 px-4 py-3.5">
                <p className="text-xs font-semibold text-sky-700 mb-1 flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  AR tip
                </p>
                <p className="text-sm text-sky-700 leading-relaxed">
                  Allow camera access and hold your phone steady, with your face centred. Good lighting gives the best result.
                </p>
              </div>
            )}
          </div>

          {/* ── RIGHT: Details ── */}
          <div className="flex flex-col">

            {/* Category badge */}
            <span className="inline-flex self-start items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-stone-100 text-stone-600 border border-stone-200 mb-3 capitalize">
              {product.category || "General"}
            </span>

            {/* Name */}
            <h1 className="text-3xl font-bold text-stone-900 leading-tight mb-1">{product.name}</h1>

            {/* Price row */}
            <div className="flex items-baseline gap-3 mt-3 mb-5">
              <span className="text-2xl font-bold text-emerald-700">
                ₦{Number(product.price).toLocaleString()}
              </span>
            </div>

            <div className="h-px bg-stone-200 mb-5" />

            {/* Description */}
            {product.description && (
              <p className="text-stone-600 text-sm leading-relaxed mb-5">{product.description}</p>
            )}

            {/* Specs table */}
            <div className="rounded-xl border border-stone-200 overflow-hidden mb-5">
              {[
                { label: "Category", value: product.category },
                { label: "AR try-on", value: product.ar_supported === 1 ? "Available" : "Not available", isAR: true },
              ]
                .filter((s) => s.value)
                .map((spec, i, arr) => (
                  <div
                    key={spec.label}
                    className={`flex justify-between items-center px-4 py-3 text-sm ${
                      i < arr.length - 1 ? "border-b border-stone-100" : ""
                    }`}
                  >
                    <span className="text-stone-500">{spec.label}</span>
                    <span
                      className={`font-medium capitalize ${
                        spec.isAR && product.ar_supported === 1
                          ? "text-violet-700"
                          : "text-stone-800"
                      }`}
                    >
                      {spec.isAR && product.ar_supported === 1 && (
                        <span className="inline-flex items-center gap-1">
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {spec.value}
                        </span>
                      )}
                      {!(spec.isAR && product.ar_supported === 1) && spec.value}
                    </span>
                  </div>
                ))}
            </div>

            {/* Size selector — only for clothing */}
            {isClothing && (
              <div className="mb-6">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2.5">Select size</p>
                <div className="flex gap-2 flex-wrap">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-xl text-sm font-medium border transition-all ${
                        selectedSize === size
                          ? "bg-stone-900 text-white border-stone-900"
                          : "bg-white text-stone-700 border-stone-200 hover:border-stone-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col gap-3 mt-auto">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-stone-900 text-white text-sm font-medium rounded-xl hover:bg-stone-800 active:scale-[0.98] transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 11H4L5 9z" />
                  </svg>
                  {addedToCart ? "Added!" : "Add to cart"}
                </button>

                <button
                  onClick={() => setWishlisted((w) => !w)}
                  className={`w-14 flex items-center justify-center rounded-xl border transition-all ${
                    wishlisted
                      ? "bg-rose-50 border-rose-200 text-rose-500"
                      : "bg-white border-stone-200 text-stone-400 hover:border-stone-400"
                  }`}
                  aria-label="Wishlist"
                >
                  <svg className="w-5 h-5" fill={wishlisted ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </button>
              </div>

              {product.ar_supported === 1 && (
                <button
                  onClick={handleAR}
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M3 8a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V8z" />
                  </svg>
                  Try on with AR
                </button>
              )}

              <button
                onClick={() => {
                  alert("Purchase simulation: Order placed successfully!");
                  navigate("/");
                }}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-violet-700 text-white text-sm font-medium rounded-xl hover:bg-violet-800 active:scale-[0.98] transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Buy now
              </button>
            </div>

            {/* Trust signals */}
            <div className="mt-5 pt-5 border-t border-stone-200 flex flex-wrap gap-4 text-xs text-stone-400">
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                Free delivery over ₦20,000
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                14-day returns
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Secure checkout
              </span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}