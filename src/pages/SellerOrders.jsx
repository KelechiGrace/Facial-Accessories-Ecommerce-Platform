import React, { useEffect, useState } from "react";
import SellerLayout from "./SellerLayout";

export default function SellerOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/orders")
      .then((res) => res.json())
      .then((data) => setOrders(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <SellerLayout>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      <table className="w-full bg-white shadow rounded">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Order ID</th>
            <th className="text-left">Products</th>
            <th className="text-left">Status</th>
            <th className="text-left">Total</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-t">
              <td className="p-3">{o.id}</td>

              <td>
                {o.items?.map((item, index) => (
                  <div key={index}>
                    {item.name} × {item.quantity}
                  </div>
                ))}
              </td>

              <td>
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded">
                  {o.status}
                </span>
              </td>

              <td>₦{o.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </SellerLayout>
  );
}