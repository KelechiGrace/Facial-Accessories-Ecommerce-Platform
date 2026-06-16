import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const bodyTypeInfo = {
  pear: {
    label: "Pear",
    emoji: "🍐",
    message: "Your hips are wider than your bust - styles that balance upward work beautifully on you.",
    tips: ["Embellished or bold tops", "A-line & flared skirts", "Wide-leg trousers", "Wrap dresses"],
  },
  hourglass: {
    label: "Hourglass",
    emoji: "⌛",
    message: "Your bust and hips are balanced with a defined waist - almost every silhouette works for you.",
    tips: ["Wrap dresses", "Belted coats", "Fitted blazers", "Bodycon styles"],
  },
  rectangle: {
    label: "Rectangle",
    emoji: "▭",
    message: "Your proportions are even all around - styles that add curves and definition suit you best.",
    tips: ["Peplum tops", "Ruffled skirts", "Belted dresses", "Layered outfits"],
  },
  inverted_triangle: {
    label: "Inverted Triangle",
    emoji: "🔺",
    message: "Your shoulders are broader than your hips - drawing attention downward creates great balance.",
    tips: ["Flared trousers", "A-line skirts", "V-necks", "Wide-leg pants"],
  },
  apple: {
    label: "Apple",
    emoji: "🍎",
    message: "You carry weight around the midsection - styles that elongate and flow work best.",
    tips: ["Empire waist dresses", "V-necklines", "Longline cardigans", "Flowy tops"],
  },
};

const STYLE_VIBES = [
  { key: "all",      label: "All styles",  icon: "✦" },
  { key: "casual",   label: "Casual",      icon: "☀" },
  { key: "smart",    label: "Smart",       icon: "◈" },
  { key: "glam",     label: "Glam",        icon: "✦" },
  { key: "sporty",   label: "Sporty",      icon: "◎" },
];

const OCCASIONS = [
  { key: "all",       label: "Any occasion" },
  { key: "everyday",  label: "Everyday"     },
  { key: "work",      label: "Work"         },
  { key: "going_out", label: "Going out"    },
  { key: "event",     label: "Special event"},
];

export default function Recommendations() {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [vibe, setVibe]               = useState("all");
  const [occasion, setOccasion]       = useState("all");
  const [showPrefs, setShowPrefs]     = useState(true);
  const [addedIds, setAddedIds]       = useState([]);

  const bodyType =
    location.state?.bodyType ||
    localStorage.getItem("bodyType") ||
    "rectangle";

  const info = bodyTypeInfo[bodyType] || bodyTypeInfo.rectangle;

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((res) => res.json())
      .then((data) => { setProducts(data); setLoading(false); })
      .catch((err) => { console.error(err); setLoading(false); });
  }, []);

  // Filter by body type, then by vibe + occasion
  // If a product has no vibe/occasion field set in the DB, it shows under ALL filters
  // (prevents products from disappearing just because the field isn't set yet)
  const filtered = products.filter((p) => {
    if (p.bodyType !== bodyType) return false;
    if (vibe !== "all" && p.vibe) {
      if (p.vibe.toLowerCase() !== vibe) return false;
    }
    if (occasion !== "all" && p.occasion) {
      if (p.occasion.toLowerCase() !== occasion) return false;
    }
    return true;
  });

  const handleAddToCart = (e, product) => {
    e.stopPropagation();
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existing = cart.find((i) => i.id === product.id);
    if (existing) existing.quantity += 1;
    else cart.push({ ...product, quantity: 1 });
    localStorage.setItem("cart", JSON.stringify(cart));
    setAddedIds((prev) => [...prev, product.id]);
    setTimeout(() => setAddedIds((prev) => prev.filter((id) => id !== product.id)), 2000);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#FAFAF8", fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .rec-page { min-height: 100vh; background: #FAFAF8; }

        /* ── HEADER ── */
        .rec-header {
          background: #fff;
          border-bottom: 1px solid #EBEBEB;
          padding: 18px 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .rec-back {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          font-size: 13px;
          font-weight: 500;
          color: #888;
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px 0;
          transition: color 0.18s;
          font-family: 'Inter', sans-serif;
        }
        .rec-back:hover { color: #1a1a1a; }
        .rec-logo {
          font-family: 'Inter', sans-serif;
          font-size: 20px;
          font-weight: 600;
          color: #7c3aed;
          letter-spacing: 0.01em;
        }
        .rec-update-btn {
          font-size: 12px;
          font-weight: 500;
          color: #7c3aed;
          background: #F3EEFF;
          border: 1px solid #E0D6F5;
          border-radius: 100px;
          padding: 7px 14px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: all 0.18s;
        }
        .rec-update-btn:hover { background: #E8D9FF; }

        /* ── HERO SECTION ── */
        .rec-hero {
          background: #fff;
          border-bottom: 1px solid #EBEBEB;
          padding: 40px 32px 32px;
          max-width: 960px;
          margin: 0 auto;
          width: 100%;
        }
        .rec-eyebrow {
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #7c3aed;
          margin-bottom: 10px;
        }
        .rec-title {
          font-family: 'Inter', sans-serif;
          font-size: 38px;
          font-weight: 500;
          color: #1a1a1a;
          line-height: 1.15;
          margin-bottom: 10px;
          letter-spacing: -0.01em;
        }
        .rec-subtitle {
          font-size: 14px;
          color: #888;
          line-height: 1.7;
          max-width: 520px;
          font-weight: 300;
        }

        /* ── BODY TYPE CHIP ── */
        .rec-type-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #F7F4FF;
          border: 1px solid #E0D6F5;
          border-radius: 100px;
          padding: 8px 16px;
          margin-top: 20px;
          font-size: 13px;
          font-weight: 500;
          color: #5b21b6;
        }
        .rec-type-chip .emoji { font-size: 16px; }
        .rec-type-chip .change {
          font-size: 11px;
          color: #a78bfa;
          cursor: pointer;
          text-decoration: underline;
          text-underline-offset: 2px;
          background: none;
          border: none;
          font-family: 'Inter', sans-serif;
          padding: 0;
        }

        /* ── TIPS STRIP ── */
        .rec-tips {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-top: 16px;
        }
        .rec-tip-tag {
          font-size: 12px;
          color: #7c3aed;
          background: #F3EEFF;
          border: 1px solid #E0D6F5;
          border-radius: 6px;
          padding: 4px 10px;
          font-weight: 400;
        }

        /* ── PREFERENCE PANEL ── */
        .rec-prefs-wrap {
          max-width: 960px;
          margin: 0 auto;
          padding: 0 32px;
          width: 100%;
        }
        .rec-prefs-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 18px 0 14px;
          border-bottom: 1px solid #EBEBEB;
          cursor: pointer;
        }
        .rec-prefs-toggle-label {
          font-size: 13px;
          font-weight: 600;
          color: #1a1a1a;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .rec-prefs-toggle-label .dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #7c3aed;
        }
        .rec-prefs-toggle-sub { font-size: 12px; color: #aaa; font-weight: 400; }
        .rec-prefs-chevron {
          font-size: 12px;
          color: #aaa;
          transition: transform 0.2s;
        }
        .rec-prefs-chevron.open { transform: rotate(180deg); }

        .rec-prefs-body {
          padding: 20px 0 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          border-bottom: 1px solid #EBEBEB;
        }
        .rec-pref-section-label {
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #bbb;
          margin-bottom: 10px;
        }
        .rec-pill-row { display: flex; flex-wrap: wrap; gap: 8px; }
        .rec-pill {
          padding: 8px 16px;
          border-radius: 100px;
          border: 1px solid #E5E5E5;
          background: #fff;
          font-size: 13px;
          font-weight: 400;
          color: #555;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: all 0.15s;
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .rec-pill:hover { border-color: #c4b5fd; color: #7c3aed; }
        .rec-pill.active {
          background: #7c3aed;
          border-color: #7c3aed;
          color: #fff;
          font-weight: 500;
        }

        /* ── RESULTS META ── */
        .rec-results-meta {
          max-width: 960px;
          margin: 0 auto;
          padding: 20px 32px 14px;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }
        .rec-results-count {
          font-size: 13px;
          color: #888;
          font-weight: 400;
        }
        .rec-results-count strong { color: #1a1a1a; font-weight: 600; }
        .rec-clear-btn {
          font-size: 12px;
          color: #7c3aed;
          background: none;
          border: none;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          text-decoration: underline;
          text-underline-offset: 2px;
          padding: 0;
        }

        /* ── PRODUCT GRID ── */
        .rec-grid {
          max-width: 960px;
          margin: 0 auto;
          padding: 0 32px 60px;
          width: 100%;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 20px;
        }

        .rec-card {
          background: #fff;
          border-radius: 16px;
          border: 1px solid #EBEBEB;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.22s;
          display: flex;
          flex-direction: column;
        }
        .rec-card:hover {
          border-color: #D0C4F7;
          box-shadow: 0 8px 28px rgba(124,58,237,0.09);
          transform: translateY(-3px);
        }

        .rec-card-img {
          width: 100%;
          aspect-ratio: 3/4;
          object-fit: cover;
          background: #F5F5F3;
          display: block;
        }

        .rec-card-body {
          padding: 14px 16px 16px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          flex: 1;
        }

        .rec-card-name {
          font-size: 13px;
          font-weight: 500;
          color: #1a1a1a;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .rec-card-price {
          font-size: 15px;
          font-weight: 600;
          color: #059669;
          font-family: 'Inter', sans-serif;
        }

        .rec-card-btn {
          width: 100%;
          padding: 9px 0;
          border-radius: 8px;
          border: 1px solid #E5E5E5;
          background: #fff;
          font-size: 12px;
          font-weight: 500;
          color: #1a1a1a;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          transition: all 0.18s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: auto;
        }
        .rec-card-btn:hover { background: #1a1a1a; color: #fff; border-color: #1a1a1a; }
        .rec-card-btn.added { background: #059669; color: #fff; border-color: #059669; }

        /* ── EMPTY STATE ── */
        .rec-empty {
          max-width: 960px;
          margin: 0 auto;
          padding: 60px 32px;
          text-align: center;
        }
        .rec-empty-icon { font-size: 40px; margin-bottom: 16px; opacity: 0.4; }
        .rec-empty-title { font-size: 16px; font-weight: 600; color: #1a1a1a; margin-bottom: 6px; }
        .rec-empty-sub { font-size: 13px; color: #aaa; line-height: 1.6; }

        /* ── LOADING ── */
        .rec-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          gap: 14px;
        }
        .rec-spinner {
          width: 28px; height: 28px;
          border: 2px solid #E5E5E5;
          border-top-color: #7c3aed;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        .rec-loading p { font-size: 13px; color: #aaa; }

        @media (max-width: 600px) {
          .rec-hero, .rec-prefs-wrap, .rec-results-meta, .rec-grid {
            padding-left: 20px;
            padding-right: 20px;
          }
          .rec-title { font-size: 28px; }
          .rec-header { padding: 16px 20px; }
        }
      `}</style>

      <div className="rec-page">

        {/* HEADER */}
        <div className="rec-header">
          <button className="rec-back" onClick={() => navigate("/")}>
            ← Back
          </button>
          <div className="rec-logo ">AssistMart</div>
          <button className="rec-update-btn" onClick={() => navigate("/measurements")}>
            Update measurements
          </button>
        </div>

        {/* HERO */}
        <div style={{ background: "#fff", borderBottom: "1px solid #EBEBEB" }}>
          <div className="rec-hero">
            <div className="rec-eyebrow">Personalised for you</div>
            <h1 className="rec-title">Your style<br />recommendations</h1>
            <p className="rec-subtitle">{info.message}</p>

            <div className="rec-type-chip">
              <span className="emoji">{info.emoji}</span>
              <span>{info.label} body type</span>
            </div>

            <div className="rec-tips">
              {info.tips.map((tip) => (
                <span key={tip} className="rec-tip-tag">{tip}</span>
              ))}
            </div>
          </div>
        </div>

        {/* PREFERENCE PANEL */}
        <div className="rec-prefs-wrap">
          <div className="rec-prefs-toggle" onClick={() => setShowPrefs((p) => !p)}>
            <div className="rec-prefs-toggle-label">
              <span className="dot" />
              Refine your results
              <span className="rec-prefs-toggle-sub">
                {vibe !== "all" || occasion !== "all" ? "· Filters active" : "· Tap to personalise further"}
              </span>
            </div>
            <span className={`rec-prefs-chevron ${showPrefs ? "open" : ""}`}>▼</span>
          </div>

          {showPrefs && (
            <div className="rec-prefs-body">
              {/* Style Vibe */}
              <div>
                <div className="rec-pref-section-label">Style vibe</div>
                <div className="rec-pill-row">
                  {STYLE_VIBES.map((v) => (
                    <button
                      key={v.key}
                      className={`rec-pill ${vibe === v.key ? "active" : ""}`}
                      onClick={() => setVibe(v.key)}
                    >
                      {v.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Occasion */}
              <div>
                <div className="rec-pref-section-label">Occasion</div>
                <div className="rec-pill-row">
                  {OCCASIONS.map((o) => (
                    <button
                      key={o.key}
                      className={`rec-pill ${occasion === o.key ? "active" : ""}`}
                      onClick={() => setOccasion(o.key)}
                    >
                      {o.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* RESULTS META */}
        {!loading && (
          <div className="rec-results-meta">
            <p className="rec-results-count">
              Showing <strong>{filtered.length}</strong> piece{filtered.length !== 1 ? "s" : ""}
              {vibe !== "all" && <> · <span style={{ color: "#7c3aed" }}>{STYLE_VIBES.find(v => v.key === vibe)?.label}</span></>}
              {occasion !== "all" && <> · <span style={{ color: "#7c3aed" }}>{OCCASIONS.find(o => o.key === occasion)?.label}</span></>}
            </p>
            {(vibe !== "all" || occasion !== "all") && (
              <button className="rec-clear-btn" onClick={() => { setVibe("all"); setOccasion("all"); }}>
                Clear filters
              </button>
            )}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <div className="rec-loading">
            <div className="rec-spinner" />
            <p>Finding your best looks…</p>
          </div>
        )}

        {/* GRID */}
        {!loading && filtered.length > 0 && (
          <div className="rec-grid">
            {filtered.map((product, i) => (
              <div
                key={product.id}
                className="rec-card"
                style={{ animationDelay: `${i * 40}ms` }}
                onClick={() => navigate(`/product/${product.id}`)}
              >
                <img
                  src={product.image_url || "https://via.placeholder.com/300x400?text=No+Image"}
                  alt={product.name}
                  className="rec-card-img"
                  onError={(e) => (e.target.src = "https://via.placeholder.com/300x400?text=No+Image")}
                />
                <div className="rec-card-body">
                  <div className="rec-card-name">{product.name}</div>
                  <div className="rec-card-price">₦{Number(product.price).toLocaleString()}</div>
                  <button
                    className={`rec-card-btn ${addedIds.includes(product.id) ? "added" : ""}`}
                    onClick={(e) => handleAddToCart(e, product)}
                  >
                    {addedIds.includes(product.id) ? (
                      <>✓ Added</>
                    ) : (
                      <>
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 11H4L5 9z" />
                        </svg>
                        Add to cart
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && filtered.length === 0 && (
          <div className="rec-empty">
            <div className="rec-empty-icon">🪄</div>
            <div className="rec-empty-title">
              {vibe !== "all" || occasion !== "all"
                ? "No matches for these filters"
                : "No recommendations yet for your body type"}
            </div>
            <p className="rec-empty-sub">
              {vibe !== "all" || occasion !== "all"
                ? "Try clearing your filters to see all available pieces for your body type."
                : "New pieces are being added — check back soon."}
            </p>
            {(vibe !== "all" || occasion !== "all") && (
              <button
                onClick={() => { setVibe("all"); setOccasion("all"); }}
                style={{
                  marginTop: "16px", padding: "10px 22px",
                  background: "#7c3aed", color: "#fff",
                  border: "none", borderRadius: "100px",
                  fontSize: "13px", fontWeight: "500",
                  cursor: "pointer", fontFamily: "'Inter', sans-serif"
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        )}

       

      </div>
    </div>
  );
}