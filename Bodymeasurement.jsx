import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const BODY_TYPE_INFO = {
  pear: {
    label: "Pear", emoji: "🍐",
    description: "Your hips are wider than your bust. You carry weight in your lower body.",
    tips: ["A-line skirts", "Wide-leg trousers", "Embellished tops"],
  },
  hourglass: {
    label: "Hourglass", emoji: "⌛",
    description: "Your bust and hips are balanced with a defined waist.",
    tips: ["Wrap dresses", "Belted coats", "Fitted blazers"],
  },
  inverted_triangle: {
    label: "Inverted Triangle", emoji: "🔺",
    description: "Your shoulders and bust are broader than your hips.",
    tips: ["Flared trousers", "A-line skirts", "V-neck tops"],
  },
  rectangle: {
    label: "Rectangle", emoji: "▭",
    description: "Your bust, waist, and hips are roughly the same width.",
    tips: ["Peplum tops", "Ruffled skirts", "Belted dresses"],
  },
  apple: {
    label: "Apple", emoji: "🍎",
    description: "You carry most of your weight around the midsection.",
    tips: ["Empire waist dresses", "V-necks", "Longline cardigans"],
  },
};

const fields = [
  { name: "height", label: "Height", unit: "cm", icon: "↕" },
  { name: "weight", label: "Weight", unit: "kg", icon: "⚖" },
  { name: "bust", label: "Bust", unit: "cm", icon: "📏" },
  { name: "waist", label: "Waist", unit: "cm", icon: "📏" },
  { name: "hips", label: "Hips", unit: "cm", icon: "📏" },
];

export default function BodyMeasurementForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ height: "", weight: "", bust: "", waist: "", hips: "" });
  const [bodyType, setBodyType] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [errors, setErrors] = useState({});
  const [prefilled, setPrefilled] = useState(false);

  // ── Prefill from DB on load ──
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (!user.email) return;

    fetch(`http://localhost:5000/measurements/${encodeURIComponent(user.email)}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.height) {
          setForm({
            height: data.height || "",
            weight: data.weight || "",
            bust: data.bust || "",
            waist: data.waist || "",
            hips: data.hips || "",
          });
          setPrefilled(true);
        }
      })
      .catch(err => console.error("Failed to load measurements:", err));
  }, []);

  const validate = () => {
    const newErrors = {};
    fields.forEach(({ name }) => {
      if (!form[name]) newErrors[name] = "Required";
      else if (isNaN(Number(form[name])) || Number(form[name]) <= 0)
        newErrors[name] = "Enter a valid number";
    });
    return newErrors;
  };

  const calculateBodyType = () => {
    const bust = Number(form.bust);
    const waist = Number(form.waist);
    const hips = Number(form.hips);
    if (hips >= bust + 8 && hips - waist >= 20) return "pear";
    if (waist >= bust - 2 && waist >= hips)
    return "apple";
    if (bust >= hips + 8) return "inverted_triangle";
    if (Math.abs(bust - hips) <= 5 && waist < bust - 10) return "hourglass";
    return "rectangle";
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  const newErrors = validate();
  if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

  const type = calculateBodyType();
  setBodyType(type);
  setShowResult(true);

  // Save to DB — with better error logging
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  console.log("User from localStorage:", user); // ← we'll see this in console
  console.log("Email being used:", user.email);

  if (!user.email) {
    console.warn("No email found — measurements not saved");
    return;
  }

  try {
    const res = await fetch("http://localhost:5000/measurements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        height: Number(form.height),
        weight: Number(form.weight),
        bust: Number(form.bust),
        waist: Number(form.waist),
        hips: Number(form.hips),
        body_type: type,
      }),
    });
    const data = await res.json();
    console.log("Save response:", data); // ← tells us exactly what happened
  } catch (err) {
    console.error("Failed to save measurements:", err);
  }
};

  const handleSeeRecommendations = () => {
    const type = calculateBodyType();
    localStorage.setItem("bodyType", type);
    navigate("/recommendations", { state: { bodyType: type } });
  };

  const info = BODY_TYPE_INFO[bodyType];

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-violet-100 rounded-2xl mb-3">
            <svg className="w-6 h-6 text-violet-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-purple-700">Body Measurements</h1>
          <p className="text-sm text-stone-500 mt-1">Find your unique body type and styles that fit your body type best.</p>
          {/* Show prefill notice */}
          {prefilled && (
            <p className="text-xs text-violet-600 mt-2 bg-violet-50 border border-violet-100 rounded-lg px-3 py-1.5 inline-block">
              ✓ Your previous measurements have been loaded
            </p>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            {fields.map(({ name, label, unit }) => (
              <div key={name}>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">
                  {label}
                </label>
                <div className="relative">
                  <input
                    name={name}
                    type="number"
                    min="1"
                    placeholder={`Enter ${label.toLowerCase()}`}
                    value={form[name]}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 pr-14 text-sm rounded-xl border bg-stone-50 text-stone-900 placeholder-stone-400 outline-none transition-all
                      focus:bg-white focus:border-violet-400 focus:ring-2 focus:ring-violet-100
                      ${errors[name] ? "border-rose-400 bg-rose-50" : "border-stone-200"}`}
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-medium text-stone-400">
                    {unit}
                  </span>
                </div>
                {errors[name] && (
                  <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    {errors[name]}
                  </p>
                )}
              </div>
            ))}

            <button
              type="submit"
              className="mt-2 w-full py-3.5 bg-violet-700 text-white text-sm font-semibold rounded-xl hover:bg-violet-800 active:scale-[0.98] transition-all"
            >
              Calculate My Body Type
            </button>
          </form>

          {showResult && info && (
            <div className="border-t border-stone-100 bg-stone-50 p-6">
              <div className="text-center mb-4">
                <div className="text-4xl mb-2">{info.emoji}</div>
                <h2 className="text-xl font-bold text-stone-900">{info.label} Body Type</h2>
                <p className="text-sm text-stone-500 mt-1 leading-relaxed">{info.description}</p>
              </div>

              <div className="bg-violet-50 border border-violet-100 rounded-xl p-4 mb-4">
                <p className="text-xs font-semibold text-violet-700 uppercase tracking-wider mb-2">
                  Styles that suit you
                </p>
                <div className="flex flex-wrap gap-2">
                  {info.tips.map((tip) => (
                    <span key={tip} className="px-3 py-1 bg-white border border-violet-200 text-violet-700 text-xs font-medium rounded-full">
                      {tip}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSeeRecommendations}
                className="w-full py-3.5 bg-stone-900 text-white text-sm font-semibold rounded-xl hover:bg-stone-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              >
                See Outfit Recommendations
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </button>
            </div>
          )}

          <div className="px-6 py-4 border-t border-stone-100 text-center">
            <p className="text-sm text-stone-400">Not sure about your measurements?</p>
            <button
              onClick={() => navigate("/avatarselection")}
              className="text-sm text-violet-700 font-medium hover:underline mt-0.5"
            >
              Choose your body type visually instead →
            </button>
           
          </div>
        </div>
      </div>
    </div>
  );
}