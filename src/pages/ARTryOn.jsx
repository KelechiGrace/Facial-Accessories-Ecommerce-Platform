import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ARCamera from "../components/ARCamera";

const ARTryOn = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const product = location.state?.product;
  const [cameraOn, setCameraOn] = useState(false);
  const [screenshot, setScreenshot] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [cartAdded, setCartAdded] = useState(false);

  const [cartCount, setCartCount] = useState(() => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      return cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    } catch {
      return 0;
    }
  });

  if (!product) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <p className="text-gray-500 font-medium">Product not found.</p>
    </div>
  );

  const typeLabel = product.type?.includes("glasses")
    ? "Eyewear" : product.type?.includes("lipstick")
    ? "Lip Colour" : product.type?.includes("earring")
    ? "Earring" : "Accessory";

  const productImage = product.image || product.image_url || null;

  const handleScreenshot = () => {
    const canvas = document.querySelector("canvas");
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    setScreenshot(dataUrl);
    setShowShareModal(true);
  };

  const handleDownload = () => {
    if (!screenshot) return;
    const link = document.createElement("a");
    link.download = `assistmart-tryon-${product.name?.replace(/\s+/g, "-")}.png`;
    link.href = screenshot;
    link.click();
  };

  const handleStartCamera = () => {
    setCameraOn(true);
    fetch(`http://localhost:5000/ar-tryon/${product.id}`, { method: "POST" })
      .catch((err) => console.error("Failed to record AR try-on:", err));
  };

  const handleAddToCart = async () => {
    try {
      const existing = JSON.parse(localStorage.getItem("cart") || "[]");
      const alreadyIn = existing.find((item) => item.id === product.id);
      if (!alreadyIn) {
        existing.push({ ...product, quantity: 1 });
        localStorage.setItem("cart", JSON.stringify(existing));
      }
      const newCount = existing.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(newCount);
    } catch (err) {
      console.error("localStorage error:", err);
    }

    try {
      await fetch("http://localhost:5000/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: product.id, quantity: 1 }),
      });
    } catch (err) {
      console.error("Failed to save cart to DB:", err);
    }

    try {
      await fetch(`http://localhost:5000/ar-tryon/${product.id}/cart`, { method: "POST" });
    } catch (err) {
      console.error("Failed to record cart after AR:", err);
    }

    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 2500);
  };

  const handleShare = (platform) => {
    if (!screenshot) return;
    const text = encodeURIComponent(`Check out how this looks on me! "${product.name}" from AssistMart`);
    const productUrl = encodeURIComponent(window.location.origin + `/product/${product.id}`);
    const urls = {
      whatsapp: `https://wa.me/?text=${text}%20${productUrl}`,
      twitter:  `https://twitter.com/intent/tweet?text=${text}&url=${productUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${productUrl}&quote=${text}`,
      gmail:    `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(`AssistMart Try-On: ${product.name}`)}&body=${text}%20${productUrl}`,
      telegram: `https://t.me/share/url?url=${productUrl}&text=${text}`,
      instagram: null,
    };
    if (platform === "instagram") {
      handleDownload();
      alert("Image downloaded! You can now share it on Instagram.");
      return;
    }
    if (urls[platform]) window.open(urls[platform], "_blank");
  };

  const shareOptions = [
    { key: "whatsapp",  label: "WhatsApp",    icon: "💬" },
    { key: "gmail",     label: "Gmail",       icon: "✉️" },
    { key: "instagram", label: "Instagram",   icon: "📸" },
    { key: "twitter",   label: "X (Twitter)", icon: "𝕏"  },
    { key: "facebook",  label: "Facebook",    icon: "👥" },
    { key: "telegram",  label: "Telegram",    icon: "📨" },
  ];

  const placeholderIcon = product.type?.includes("glasses") ? "👓"
    : product.type?.includes("lipstick") ? "💄"
    : product.type?.includes("earring") ? "💎"
    : "✨";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* TOP BAR */}
      <div className="sticky top-0 z-50 bg-white border-b border-purple-100 shadow-sm">
        <div className="flex items-center justify-between px-8 py-4">

          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-purple-700 border border-purple-200 rounded-full px-4 py-2 hover:bg-purple-50 transition-all"
          >
            ← Back
          </button>

          <span className="text-xl font-bold text-gray-900 tracking-tight">
            Assist<span className="text-purple-700">Mart</span>
          </span>

          <div className="flex items-center gap-3">

            {/* Cart icon with badge */}
            <button
              onClick={() => navigate("/cart")}
              className="relative flex items-center justify-center w-10 h-10 rounded-full border border-purple-200 text-lg hover:bg-purple-50 transition-all"
              title="Go to cart"
            >
              🛒
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-purple-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white leading-none">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>

            {/* AR Live badge */}
            <div className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-full px-4 py-1.5 text-xs font-semibold text-purple-700 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-purple-700 rounded-full animate-pulse" />
              AR Live
            </div>

          </div>
        </div>
      </div>

      {/* BODY */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_320px] max-w-5xl mx-auto w-full px-6 py-8 gap-7">

        {/* LEFT: Camera */}
        <div className="flex flex-col gap-4">

          {/* Camera frame */}
          <div className="relative rounded-2xl overflow-hidden bg-white border border-purple-100 min-h-96 flex items-center justify-center shadow-sm">
            <span className="absolute top-3 left-3 w-5 h-5 border-t-2 border-l-2 border-purple-400 rounded-tl opacity-50 pointer-events-none" />
            <span className="absolute top-3 right-3 w-5 h-5 border-t-2 border-r-2 border-purple-400 rounded-tr opacity-50 pointer-events-none" />
            <span className="absolute bottom-3 left-3 w-5 h-5 border-b-2 border-l-2 border-purple-400 rounded-bl opacity-50 pointer-events-none" />
            <span className="absolute bottom-3 right-3 w-5 h-5 border-b-2 border-r-2 border-purple-400 rounded-br opacity-50 pointer-events-none" />

            {cameraOn ? (
              <ARCamera product={product} />
            ) : (
              <div className="flex flex-col items-center gap-4 py-20 px-6">
                <span className="text-6xl opacity-30">{placeholderIcon}</span>
                <p className="text-xs uppercase tracking-widest text-gray-400">
                  Camera preview will appear here
                </p>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex gap-3">
            {!cameraOn ? (
              <button
                onClick={handleStartCamera}
                className="flex-1 py-3.5 bg-purple-700 text-white font-semibold text-sm rounded-xl hover:bg-purple-800 active:scale-[0.98] transition-all shadow-md shadow-purple-200"
              >
                ▶ &nbsp;Start AR Try-On
              </button>
            ) : (
              <>
                <button
                  onClick={() => setCameraOn(false)}
                  className="flex-1 py-3.5 bg-white text-gray-600 font-semibold text-sm rounded-xl border border-purple-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-400 transition-all"
                >
                  ■ &nbsp;Stop Camera
                </button>
                <button
                  onClick={handleScreenshot}
                  className="py-3.5 px-5 bg-white text-gray-800 font-semibold text-sm rounded-xl border border-purple-200 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-400 transition-all flex items-center gap-2 whitespace-nowrap"
                >
                  📸 &nbsp;Share Look
                </button>
              </>
            )}
          </div>

          {/* Privacy note */}
          <p className="flex items-center gap-2 text-xs text-gray-400 px-1">
            <span>🔒</span>
            Camera is used locally for AR only. No footage is recorded or sent to any server.
          </p>
        </div>

        {/* RIGHT: Sidebar */}
        <div className="flex flex-col gap-5 order-first lg:order-last">

          {/* Product card */}
          <div className="bg-white rounded-2xl border border-purple-100 p-6 flex flex-col gap-3 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-purple-700">
              {typeLabel}
            </p>
            <h2 className="text-lg font-bold text-gray-900 leading-snug">
              {product.name}
            </h2>
            <p className="text-lg font-bold text-emerald-600">
              ₦{Number(product.price).toLocaleString()}
            </p>

            {productImage && (
              <img
                src={productImage}
                alt={product.name}
                className="w-full aspect-square object-contain rounded-xl bg-purple-50 p-4"
                onError={(e) => { e.target.style.display = "none"; }}
              />
            )}

            {product.description && (
              <p className="text-xs text-gray-400 leading-relaxed border-t border-purple-50 pt-3">
                {product.description}
              </p>
            )}

            <button
              onClick={handleAddToCart}
              className={`w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all mt-1 active:scale-[0.98]
                ${cartAdded
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-100 hover:bg-emerald-700"
                  : "bg-purple-700 text-white shadow-md shadow-purple-200 hover:bg-purple-800"
                }`}
            >
              {cartAdded ? "✓ Added to Cart" : "🛒 Add to Cart"}
            </button>
          </div>

          {/* Tips card */}
          <div className="bg-white rounded-2xl border border-purple-100 p-5 shadow-sm">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-purple-700 mb-3">
              Tips for best results
            </p>
            <ul className="flex flex-col gap-2">
              {[
                "Face the camera directly in good lighting",
                "Keep your face centred in the frame",
                "Avoid moving too quickly for better tracking",
                `Tap "Share Look" to screenshot and share with friends`,
                ...(product.stylingTip ? [product.stylingTip] : []),
              ].map((tip, i) => (
                <li key={i} className="flex gap-2 text-xs text-gray-400 leading-relaxed">
                  <span className="text-purple-400 text-base leading-none flex-shrink-0">·</span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* SHARE MODAL */}
      {showShareModal && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-5"
          onClick={() => setShowShareModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-7 w-full max-w-md flex flex-col gap-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">Share your look 📸</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 text-gray-400 hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 transition-all text-sm"
              >
                ✕
              </button>
            </div>

            {screenshot && (
              <div className="rounded-xl overflow-hidden border border-gray-100">
                <img src={screenshot} alt="Your try-on" className="w-full max-h-64 object-cover block" />
              </div>
            )}

            <div>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-3">
                Share via
              </p>
              <div className="grid grid-cols-3 gap-2.5">
                {shareOptions.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => handleShare(opt.key)}
                    className="flex flex-col items-center gap-1.5 py-3.5 px-2 rounded-xl border border-gray-100 bg-white hover:border-purple-200 hover:bg-purple-50 hover:-translate-y-0.5 hover:shadow-md transition-all"
                  >
                    <span className="text-2xl">{opt.icon}</span>
                    <span className="text-[11px] font-medium text-gray-500">{opt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="w-full py-3.5 bg-gray-900 text-white font-semibold text-sm rounded-xl hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
            >
              ⬇ &nbsp;Download Image
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ARTryOn;