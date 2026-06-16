import React, { useState, useRef, useEffect } from "react";
import { Search, ShoppingCart, User, LogOut, ChevronDown } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function Header({ cartItems = [] }) {
  const [searchValue, setSearchValue] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Read user from localStorage (set this when user logs in)
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchValue.trim()) return;
    navigate(`/search?query=${encodeURIComponent(searchValue)}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setDropdownOpen(false);
    navigate("/auth");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="flex items-center justify-between h-24">

          {/* Logo */}
          <Link to="/">
            <h1 className="text-purple-700 text-3xl font-bold">AssistMart</h1>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full px-4 py-2 pr-10 rounded-lg bg-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                <Search size={20} />
              </button>
            </form>
          </div>

          {/* User & Cart */}
          <div className="flex items-center gap-6">

            {user ? (
              // Logged in — show name + dropdown
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 text-gray-700 hover:opacity-80"
                >
                  <User size={20} />
                  <span className="font-medium text-purple-700">
                    {user.name || user.username || "User"}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm text-gray-500">Signed in as</p>
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {user.email || user.name}
                      </p>
                    </div>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Not logged in — show login link
              <Link
                to="/auth"
                className="flex items-center gap-2 text-gray-700 hover:opacity-80"
              >
                <User size={20} />
                <span>Login / Signup</span>
              </Link>
            )}

            {/* Cart */}
            <button
              onClick={() => navigate("/cart")}
              className="relative text-gray-700 hover:opacity-80"
            >
              <ShoppingCart size={24} />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-purple-600 text-white rounded-full flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Categories */}
        <nav className="border-t border-gray-200">
          <div className="flex justify-center gap-8 py-4">
            <Link to="/clothes" className="text-purple-700 hover:opacity-80">
              Clothes
            </Link>
            <Link to="/accessories" className="text-purple-700 hover:opacity-80">
              Accessories
            </Link>
            <Link to="/recommendations" className="text-purple-700 hover:opacity-80">
              Recommended for YOU
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}