
import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "../components/Header";

function CartItem({ product, onQuantityChange, onRemove }) {
  const [quantity, setQuantity] = useState(product.quantity || 1);

  const increment = () => {
    const newQty = quantity + 1;
    setQuantity(newQty);
    onQuantityChange(product.id, newQty);
  };

  const decrement = () => {
    if (quantity === 1) return;
    const newQty = quantity - 1;
    setQuantity(newQty);
    onQuantityChange(product.id, newQty);
  };

 const handleCheckout = () => {
  if (cartItems.length === 0) {
    alert("Your cart is empty");
    return;
  }

  const newOrder = {
    items: cartItems.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity
    })),

    total: totalAmount,

    status: "Pending",

    createdAt: new Date().toISOString()
  };

  // send to backend
  fetch("http://localhost:5000/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(newOrder)
  })
    .then(res => res.json())
    .then(() => {
      localStorage.removeItem("cart");

      navigate("/order-success");
    })
    .catch(err => console.error(err));
};
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <img
        src={product.image_url}
        alt={product.name}
        className="w-20 h-20 object-cover rounded"
      />

      <div className="flex-1 px-4">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-600">₦{Number(product.price).toLocaleString()}</p>

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={decrement}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            -
          </button>

          <span>{quantity}</span>

          <button
            onClick={increment}
            className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={() => onRemove(product.id)}
        className="text-red-500 hover:opacity-80"
      >
        Remove
      </button>
    </div>
  );
}

export default function Cart() {
  const navigate = useNavigate();
  const location = useLocation();

  const newProduct = location.state?.product;

  const [cartItems, setCartItems] = useState(() => {
  return JSON.parse(localStorage.getItem("cart")) || [];
});

  const handleQuantityChange = (id, newQty) => {
  const updatedCart = cartItems.map(item =>
    item.id === id ? { ...item, quantity: newQty } : item
  );

  setCartItems(updatedCart);
  localStorage.setItem("cart", JSON.stringify(updatedCart));
};

  const handleRemove = (id) => {
  const updatedCart = cartItems.filter(item => item.id !== id);

  setCartItems(updatedCart);
  localStorage.setItem("cart", JSON.stringify(updatedCart));
};

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
  if (cartItems.length === 0) {
    alert("Your cart is empty");
    return;
  }

  setTimeout(() => {
    navigate("/checkout", {
  state: { cartItems, totalAmount }
});
  }, 500);
};
  return (
    <div>
      <Header />

      <div className="max-w-[1440px] mx-auto px-8 py-10">
        <h1 className="text-purple-400 text-3xl font-bold mb-6">Cart Page</h1>

        {/* Cart Summary */}
        <div className="mb-6 p-4 bg-gray-100 rounded-lg flex flex-col gap-2">
          <h2 className="text-center mb-6 font-semibold">Cart Summary</h2>

          <div className="flex justify-between">
            <span>Total Products:</span>
            <span>{cartItems.length}</span>
          </div>

          <div className="flex justify-between font-semibold">
            <span>Total Amount:</span>
            <span>₦{totalAmount.toLocaleString()}</span>
          </div>
          
          <div className="mt-6">
           
            <button
              onClick={handleCheckout}
              className=" px-6 py-3 bg-purple-700 text-white rounded-lg hover:bg-purple-500 transition font-semibold"
            >
              Checkout(₦{totalAmount.toLocaleString()})
            </button>

            
          </div>
        </div>

        {/* Cart Items */}
        <h2 className="mb-6 font-semibold">Cart Details</h2>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {cartItems.length === 0 ? (
            <p className="p-4 text-center text-gray-500">
              Your cart is empty.
            </p>
          ) : (
            cartItems.map((item) => (
              <CartItem
                key={item.id}
                product={item}
                onQuantityChange={handleQuantityChange}
                onRemove={handleRemove}
              />
            ))
          )}
        </div>

        {/* Back to Home */}
        <div className="mt-6">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-purple-700 text-white rounded hover:bg-purple-500 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}