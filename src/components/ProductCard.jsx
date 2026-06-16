import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { HeartIcon as OutlineHeart } from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeart } from "@heroicons/react/24/solid";

const PLACEHOLDER = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='180'%3E%3Crect width='220' height='180' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='sans-serif' font-size='13'%3ENo Image%3C/text%3E%3C/svg%3E";

const getImageSrc = (image) => {
  if (!image) return PLACEHOLDER;

  // External URL (Unsplash, Cloudinary, etc.)
  if (image.startsWith("http")) return image;

  // Images in React public folder
  if (image.startsWith("/images")) return image;

  return image;
};

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);

  const handleAR = (e) => {
  e.stopPropagation();
  navigate(`/ar-tryon/${product.id}`, { state: { product } });
};

  const arSupported = product.arSupported === 1 || product.ar_supported === 1;

  console.log("ProductCard product:", product);
console.log("Image field:", product.image);
console.log("Image URL field:", product.image_url);
  const imageSrc = getImageSrc(product.image || product.image_url);

  return (
    <div
      onClick={() => navigate(`/product/${product.id}`)}
      className="relative flex flex-col justify-between bg-white rounded-lg shadow-md hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer w-[220px] h-[340px]"
    >
      <img
        src={imageSrc}
        alt={product.name}
        className="w-full h-[180px] object-cover rounded-t-lg"
        onError={(e) => { e.target.onerror = null; e.target.src = PLACEHOLDER; }}
      />

      <div className="p-3 flex flex-col justify-between flex-1">
        <h3 className="text-md font-semibold line-clamp-2">{product.name}</h3>
        <p className="text-green-700 font-bold mt-1">
          ₦{Number(product.price).toLocaleString()}
        </p>

        <div className="mt-3 flex items-center gap-2">
          {arSupported && (
            <button
              onClick={handleAR}
              className="flex-1 px-2 py-1 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition"
            >
              Try-on available
            </button>
          )}

          <button
            onClick={(e) => {
              e.stopPropagation();
              setLiked(!liked);
            }}
            className="text-red-500 hover:text-red-600 transition"
          >
            {liked ? <SolidHeart className="w-6 h-6" /> : <OutlineHeart className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </div>
  );
}