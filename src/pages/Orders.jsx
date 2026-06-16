import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get the session start time (set when user logs in)
    // If not set, use 1 hour ago as fallback
    const sessionStart = localStorage.getItem("sessionStart") || 
      new Date(Date.now() - 60 * 60 * 1000).toISOString();

    fetch("http://localhost:5000/orders")
      .then((res) => res.json())
      .then((data) => {
        // Only show orders made after session started
        const sessionOrders = data.filter(
          (order) => new Date(order.createdAt) >= new Date(sessionStart)
        );
        // Newest first
        sessionOrders.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sessionOrders);
      })
      .catch((err) => console.log(err));
  }, []);

  if (!orders.length) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50">
          <div className="text-6xl">🛍️</div>
          <h2 className="text-xl font-semibold text-gray-600">No orders yet</h2>
          <p className="text-gray-400 text-sm">You haven't placed any orders this session</p>
          <button
            onClick={() => navigate("/")}
            className="mt-2 px-6 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-600 transition"
          >
            Start Shopping
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 px-4 py-8 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-purple-700 mb-6">Your Orders</h1>

        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white shadow-md rounded-xl p-5 mb-6 border border-gray-100"
          >
            {/* Order Header */}
            <div className="flex justify-between items-center mb-3">
              <p className="font-semibold text-gray-700 text-sm">
                Order <span className="text-purple-700">#{order.id}</span>
              </p>
              <p className="text-xs text-gray-400">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>

            {/* Status Badge */}
            <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4 ${
              order.status === "Delivered"
                ? "bg-green-100 text-green-700"
                : order.status === "Cancelled"
                ? "bg-red-100 text-red-700"
                : "bg-yellow-100 text-yellow-700"
            }`}>
              {order.status || "Pending"}
            </span>

            {/* Items */}
            <div className="flex flex-col gap-3">
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 border-b border-gray-50 pb-3 last:border-0"
                >
                  {/* Image — checks image_url, image, or falls back to placeholder */}
                  <img
                    src={item.image_url || item.image || `https://via.placeholder.com/64x64?text=${encodeURIComponent(item.name)}`}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg border border-gray-100 bg-gray-50"
                    onError={(e) => {
                      e.target.src = `https://via.placeholder.com/64x64?text=Item`;
                    }}
                  />

                  <div className="flex-1">
                    <p className="font-medium text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-400">Qty: {item.quantity || 1}</p>
                  </div>

                  <p className="font-semibold text-gray-700">
                    ₦{Number(item.price * (item.quantity || 1)).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="text-right mt-4 pt-3 border-t border-gray-100">
              <span className="text-sm text-gray-500">Total: </span>
              <span className="font-bold text-lg text-purple-700">
                ₦{Number(order.total).toLocaleString()}
              </span>
            </div>
          </div>
        ))}

        <button
          onClick={() => navigate("/")}
          className="w-full py-3 bg-purple-700 text-white rounded-xl hover:bg-purple-600 transition font-semibold"
        >
          Continue Shopping
        </button>
      </div>
    </>
  );
}