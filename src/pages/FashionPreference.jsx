import { useNavigate } from "react-router-dom";

export default function FashionPreference() {
  const navigate = useNavigate();

  return (
    
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center">
        
        <h2 className="text-2xl font-bold mb-4 text-purple-600">
          Choose Your Fashion Preference
        </h2>

        <p className="text-gray-600 mb-8">
          This helps us personalize your shopping experience.
        </p>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/measurements")}
            className="w-full py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            👗 Women’s Fashion
          </button>

          <button
            onClick={() => navigate("/clothes")}
            className="w-full py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-100 transition"
          >
            👔 Men’s Fashion
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-full text-sm text-gray-500 hover:underline"
          >
            Skip for now
          </button>
        </div>

      </div>
    </div>
  );
}
