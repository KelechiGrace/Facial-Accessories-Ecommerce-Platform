import React from "react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative flex items-center justify-center overflow-hidden h-[450px] bg-gradient-to-br from-purple-600 to-gray-300">
      
      <div className="absolute inset-0 flex">
        <div className="w-1/3 h-full opacity-30">
          <img 
            src="https://images.unsplash.com/photo-1620777888789-0ee95b57a277?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmYXNoaW9uJTIwbW9kZWwlMjB3ZWFyaW5nJTIwY2xvdGhlc3xlbnwxfHx8fDE3NjUxMTkzMjJ8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Fashion model"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-1/3 h-full opacity-30">
          <img 
            src="https://images.unsplash.com/flagged/photo-1553802922-e345434156e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBqYWNrZXQlMjBmYXNoaW9ufGVufDF8fHx8MTc2NTExOTMyMnww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Fashion clothing"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="w-1/3 h-full opacity-30">
          <img 
            src="/images/Hero_glasses.png"
            alt="AR accessories"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Center Text & Buttons */}
      <div className="relative z-10 text-center text-white">
        <h2 className="text-5xl md:text-6xl font-bold mb-8">
          Discover Your Perfect Fit
        </h2>

        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-5">
          <button 
          onClick={() => navigate("/clothes")}
          className="px-8 py-4 rounded-lg bg-purple-700 hover:bg-purple-500 transition-colors">
            Shop Now
          </button>
          <button 
          onClick={() => navigate("/accessories")}
          className="px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-400 transition-colors">
            Try Accessories in Real Time
          </button>
        </div>
      </div>
    </section>
  );
}
