import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function SellerLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("admin");
    navigate("/auth");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-purple-700 text-white p-6 flex flex-col">
        <h1 className="text-2xl font-bold">AssistMart</h1>

        <nav className="mt-6 flex flex-col gap-2">
          <Link
            to="/seller-dashboard"
            className={`px-4 py-2 rounded ${
              location.pathname === "/seller-dashboard"
                ? "bg-purple-900"
                : "hover:bg-purple-800"
            }`}
          >
            Dashboard
          </Link>

          <Link
            to="/seller/products"
            className={`px-4 py-2 rounded ${
              location.pathname === "/seller/products"
                ? "bg-purple-900"
                : "hover:bg-purple-800"
            }`}
          >
            Products
          </Link>

          <Link
            to="/seller/orders"
            className={`px-4 py-2 rounded ${
              location.pathname === "/seller/orders"
                ? "bg-purple-900"
                : "hover:bg-purple-800"
            }`}
          >
            Orders
          </Link>
        </nav>

        {/* PROFILE SECTION */}
        <div className="mt-auto pt-6 border-t border-purple-500">
          <div className="text-sm">
            <p className="font-bold">Admin</p>
            <p className="text-purple-200">admin@assistmart.com</p>
          </div>

          <button
            onClick={handleLogout}
            className="mt-4 w-full bg-white text-purple-700 py-2 rounded"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Page Content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}