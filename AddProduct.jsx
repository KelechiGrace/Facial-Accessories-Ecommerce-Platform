import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image_url: "",
  });

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  // ADD PRODUCT
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch("http://localhost:5000/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then(() => {
        alert("Product added!");
        navigate("/seller/add-products");
      })
      .catch((err) => console.error(err));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow w-full max-w-md"
      >
        <h1 className="text-2xl font-bold text-purple-700 mb-6 text-center">
          Add Product
        </h1>

        {/* NAME */}
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={product.name}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
          required
        />

        {/* PRICE */}
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={product.price}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
          required
        />

        {/* CATEGORY */}
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={product.category}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
          required
        />

        {/* IMAGE */}
        <input
          type="text"
          name="image_url"
          placeholder="/images/product.png"
          value={product.image_url}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-3"
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          placeholder="Description"
          value={product.description}
          onChange={handleChange}
          className="w-full border p-2 rounded mb-4"
        />

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800"
        >
          Add Product
        </button>
      </form>
    </div>
  );
}