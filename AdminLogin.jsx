import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.role === "seller") {
        localStorage.setItem("user", JSON.stringify({
          email, name: data.name, role: "seller"
        }));
        navigate("/seller-dashboard");
      } else {
        alert("Access denied. Sellers only.");
      }
    } catch {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-white rounded-lg p-8 w-full max-w-sm shadow-xl">
        <h1 className="text-2xl font-bold text-purple-700 mb-2 text-center">AssistMart</h1>
        <p className="text-center text-gray-500 text-sm mb-6">Business Management System </p>  {/* Seller Portal */}
        <form className="flex flex-col gap-4" onSubmit={handleLogin}>
          <input type="email" placeholder="Seller Email" required
            value={email} onChange={(e) => setEmail(e.target.value)}
            className="border rounded px-4 py-2" />
          <input type="password" placeholder="Password" required
            value={password} onChange={(e) => setPassword(e.target.value)}
            className="border rounded px-4 py-2" />
          <button disabled={loading}
            className="bg-purple-700 text-white py-2 rounded disabled:opacity-50">
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}