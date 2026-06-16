import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login");
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("form");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // =========================
  // LOGIN
  // =========================
  const handleLogin = async (e) => {
  e.preventDefault();
  if (loading) return;
  setLoading(true);

  try {
    // Look up user's real name from DB
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      const userData = { email, name: data.name,role: data.role || "buyer"};
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("sessionStart", new Date().toISOString());

      if (allowedSellers.includes(email)) {
        navigate("/seller-dashboard");
      } else {
        navigate("/");
      }
    } else {
      alert(data.message || "Login failed");
    }
  } catch (err) {
    // Fallback if server is down
    const userData = { email, name: email.split("@")[0] };
    localStorage.setItem("user", JSON.stringify(userData));
    navigate("/");
  } finally {
    setLoading(false);
  }
};

  // =========================
  // SIGNUP
  // =========================
  const handleSignup = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

 

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("OTP sent to your email. Please check your spam folder too!");
        setStep("otp");
      } else {
        alert(data.message || "Error sending OTP");
      }
    } catch (err) {
      console.log(err);
      alert("Server error — is your backend running?");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // VERIFY OTP
  // =========================
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();

      if (res.ok) {
        const userData = { email, name: data.name || name || email.split("@")[0], role: "buyer" };
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("sessionStart", new Date().toISOString()); // ← inside try
        alert("Verified successfully!");
        navigate("/fashionpreference");
      } else {
        alert(data.message || "Invalid OTP");
      }
    } catch (err) {
      console.log(err);
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-4xl font-bold text-purple-700 mb-8">AssistMart</h1>

      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8">

        <div className="flex mb-6 border-b border-gray-300">
          <button
            className={`flex-1 py-2 font-semibold ${activeTab === "login" ? "border-b-2 border-purple-700 text-purple-700" : "text-gray-500"}`}
            onClick={() => { setActiveTab("login"); setStep("form"); setLoading(false); }}
          >
            Login
          </button>
          <button
            className={`flex-1 py-2 font-semibold ${activeTab === "signup" ? "border-b-2 border-purple-700 text-purple-700" : "text-gray-500"}`}
            onClick={() => { setActiveTab("signup"); setStep("form"); setLoading(false); }}
          >
            Sign Up
          </button>
        </div>

        {activeTab === "login" && (
          <form className="flex flex-col gap-4" onSubmit={handleLogin}>
            <input type="email" placeholder="Email" required value={email}
              onChange={(e) => setEmail(e.target.value)} className="border rounded px-4 py-2" />
            <input type="password" placeholder="Password" required value={password}
              onChange={(e) => setPassword(e.target.value)} className="border rounded px-4 py-2" />
            <button disabled={loading} className="bg-purple-700 text-white py-2 rounded disabled:opacity-50">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        )}

        {activeTab === "signup" && step === "form" && (
          <form className="flex flex-col gap-4" onSubmit={handleSignup}>
            <input type="text" placeholder="Your Name" required value={name}
              onChange={(e) => setName(e.target.value)} className="border rounded px-4 py-2" />
            <input type="email" placeholder="Email" required value={email}
              onChange={(e) => setEmail(e.target.value)} className="border rounded px-4 py-2" />
            <input type="password" placeholder="Password" required value={password}
              onChange={(e) => setPassword(e.target.value)} className="border rounded px-4 py-2" />
            
            <button disabled={loading} className="bg-purple-700 text-white py-2 rounded disabled:opacity-50">
              {loading ? "Sending OTP..." : "Sign Up"}
            </button>
          </form>
        )}

        {activeTab === "signup" && step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
            <h2 className="text-center font-semibold text-purple-700">Enter OTP sent to your email</h2>
            <p className="text-center text-sm text-gray-500">
              Sent to: <span className="font-medium">{email}</span>
            </p>
            <input type="text" placeholder="Enter OTP" value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border rounded px-4 py-2 text-center tracking-widest text-lg" />
            <button disabled={loading} className="bg-green-600 text-white py-2 rounded disabled:opacity-50">
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
            <button type="button" onClick={() => setStep("form")}
              className="text-sm text-gray-500 underline text-center">
              Wrong email? Go back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}