import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    image: "",
  });

  // FETCH PRODUCT
  useEffect(() => {
    fetch(`http://localhost:5000/products/${id}`)
      .then((res) => res.json())
      .then((data) => setProduct(data))
      .catch((err) => console.error(err));
  }, [id]);

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setProduct({
      ...product,
      [e.target.name]: e.target.value,
    });
  };

  // UPDATE PRODUCT
  const handleSubmit = (e) => {
    e.preventDefault();

    fetch(`http://localhost:5000/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then(() => {
        alert("Product updated!");
        navigate("/seller/products");
      })
      .catch((err) => console.error(err));
  };

  // DELETE PRODUCT
  const handleDelete = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    fetch(`http://localhost:5000/products/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        alert("Product deleted!");
        navigate("/seller/products");
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
          Edit Product
        </h1>

        {/* NAME */}
        <input
          type="text"
          name="name"
          value={product.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full border p-2 rounded mb-3"
        />

        {/* PRICE */}
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full border p-2 rounded mb-3"
        />

        {/* CATEGORY */}
        <input
          type="text"
          name="category"
          value={product.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full border p-2 rounded mb-3"
        />

        {/* IMAGE */}
        <input
          type="text"
          name="image"
          value={product.image}
          onChange={handleChange}
          placeholder="/images/product.png"
          className="w-full border p-2 rounded mb-3"
        />

        {/* DESCRIPTION */}
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border p-2 rounded mb-4"
        />

        {/* BUTTONS */}
        <div className="flex gap-3">
          <button
            type="submit"
            className="flex-1 bg-purple-700 text-white py-2 rounded hover:bg-purple-800"
          >
            Update
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}