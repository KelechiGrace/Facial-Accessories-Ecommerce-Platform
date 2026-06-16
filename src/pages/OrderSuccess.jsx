import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg text-center max-w-md w-full">
        
        {/* Icon */}
        <div className="text-green-600 text-5xl mb-4">✅</div>

        {/* Title */}
        <h1 className="text-2xl font-bold mb-2">
          Order Successful!
        </h1>

        {/* Message */}
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your order has been placed successfully
          and will be delivered soon.
        </p>

        {/* Buttons */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => navigate("/")}
            className="w-full py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-500 transition"
          >
            Continue Shopping
          </button>

          <button
            onClick={() => navigate("/orders")}
            className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          >
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;