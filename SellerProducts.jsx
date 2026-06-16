import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SellerLayout from "./SellerLayout";

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then(res => res.json())
      .then(setProducts);
  }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SellerLayout>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold">Manage Products</h1>

        <Link
          to="/seller/add-product"
          className="bg-purple-700 text-white px-4 py-2 rounded"
        >
          + Add Product
        </Link>
      </div>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search product..."
        className="mb-4 p-2 border w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <table className="w-full bg-white">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th>Price</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map(p => (
            <tr key={p.id} className="border-t">
              <td className="p-2">{p.name}</td>
              <td>₦{p.price}</td>
              <td>{p.category}</td>
              <td>
                <Link
                  to={`/seller/edit/${p.id}`}
                  className="text-purple-700"
                >
                  Edit
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </SellerLayout>
  );
}