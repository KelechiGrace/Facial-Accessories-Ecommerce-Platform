import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePaystackPayment } from "react-paystack";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const cartItems = location.state?.cartItems || [];
  const totalAmount = location.state?.totalAmount || 0;

  const [paymentMethod, setPaymentMethod] = useState("delivery");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🟡 SAVE ORDER FUNCTION
  const saveOrder = async (reference = null) => {
    const newOrder = {
      customerName: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      state: form.state,
      items: cartItems,
      total: totalAmount,
      status: paymentMethod === "paystack" ? "Paid" : "Pending",
      paymentReference: reference,
      createdAt: new Date().toISOString(),
    };

    const res = await fetch("http://localhost:5000/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder),
    });

    if (!res.ok) throw new Error("Order failed");

      localStorage.removeItem("cart");
    navigate("/order-success", { state: { order: newOrder } });
  };

  // 🟢 PAYSTACK PAYMENT
  const handlePaystackPayment = () => {
    if (!form.name || !form.email || !form.phone || !form.address) {
      alert("Please fill all required fields");
      return;
    }

    const config = {
      reference: new Date().getTime().toString(),
      email: form.email,
      amount: totalAmount * 100, // kobo
      publicKey: "pk_test_fe9bda3e5c5db9c1c0277e271f85fda3ee650165",
    };

    const initializePayment = usePaystackPayment(config);

    initializePayment(
  async (reference) => {
    setLoading(true);

    try {
      const order = await saveOrder(reference.reference);

      // ✅ SUCCESS → go to success page
      navigate("/order-success", {
        state: {
          order,
          status: "success",
        },
      });

    } catch (err) {
      console.error(err);

      // ⚠️ payment ok but order failed
      alert("Payment successful but order failed. Try again.");

      navigate("/checkout", {
        state: { status: "failed" },
      });
    } finally {
      setLoading(false);
    }
  },

  () => {
    // ❌ user cancelled payment
    alert("Payment cancelled. Please try again.");

    navigate("/checkout", {
      state: { status: "cancelled" },
    });
  }
);
  };

  // 🟢 MAIN BUTTON LOGIC
  const handlePlaceOrder = async () => {
    if (!form.name || !form.email || !form.phone || !form.address) {
      alert("Please fill all required fields");
      return;
    }

    if (cartItems.length === 0) {
      alert("Cart is empty");
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === "delivery") {
        await saveOrder();
      } else {
        handlePaystackPayment();
      }
    } catch (err) {
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
   
  <div className="max-w-6xl mx-auto p-6">

    <div className="flex justify-end mb-4">
      <button
        onClick={() => navigate("/order-success")}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Next →
      </button>
    </div>

    <div className="grid md:grid-cols-3 gap-8">

      {/* LEFT SIDE */}
      <div className="md:col-span-2 space-y-6">

   
        {/* SHIPPING */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Shipping Details</h2>

          <div className="grid md:grid-cols-2 gap-3">
            <input name="name" placeholder="Full Name" onChange={handleChange} className="input" />
            <input name="email" placeholder="Email" onChange={handleChange} className="input" />
            <input name="phone" placeholder="Phone" onChange={handleChange} className="input md:col-span-2" />
            <input name="address" placeholder="Address" onChange={handleChange} className="input md:col-span-2" />
            <input name="city" placeholder="City" onChange={handleChange} className="input" />
            <input name="state" placeholder="State" onChange={handleChange} className="input" />
          </div>
        </div>

        {/* PAYMENT */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Payment Method</h2>

          <div className="space-y-3">
            <label className="flex gap-2">
              <input
                type="radio"
                checked={paymentMethod === "delivery"}
                onChange={() => setPaymentMethod("delivery")}
              />
              Pay on Delivery
            </label>

            <label className="flex gap-2">
              <input
                type="radio"
                checked={paymentMethod === "paystack"}
                onChange={() => setPaymentMethod("paystack")}
              />
              Pay with Card (Paystack)
            </label>
          </div>
        </div>
        
      </div>


  
  
      {/* RIGHT SIDE */}
      

      
      <div className="bg-gray-50 p-6 rounded-xl shadow h-fit sticky top-5">
        

        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

        <div className="space-y-2 mb-4">
          {cartItems.map((item, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span>{item.name}</span>
              <span>₦{item.price}</span>
            </div>
          ))}
        </div>

        <hr />

        <div className="mt-3 flex justify-between font-bold">
          <span>Total</span>
          <span>₦{totalAmount.toLocaleString()}</span>
        </div>

        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="mt-6 w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800 disabled:opacity-50"
        >
          {loading
            ? "Processing..."
            : paymentMethod === "paystack"
            ? "Pay Now"
            : "Place Order"}
        </button>

        <p className="text-xs text-center text-gray-500 mt-2">
          🔒 Secure checkout powered by Paystack
        </p>
      </div>
      
    </div>
    </div>
  );
};

export default Checkout;