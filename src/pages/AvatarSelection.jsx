import React, { useState } from "react";
import { Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const avatarData = [
  {
    id: "hourglass",
    name: "Hourglass",
    imageUrl: "/images/hourglassavatar.jpg",
    description: "Balanced shoulders & hips, defined waist",
  },
  {
    id: "pear",
    name: "Pear",
    imageUrl:"/images/pearavatar.png",
    description: "Hips wider than shoulders",
  },
  {
    id: "inverted_triangle",
    name: "Inverted Triangle",
    imageUrl:"/images/invertedtriangle.png",
    description: "Shoulders wider than hips",
  },

  {
    id: "rectangle",
    name: "Rectangle",
    imageUrl:"/images/rectangle 2.jpg",
    description: "Similar measurements, less defined waist",
  },
  {
    id: "apple",
    name: "Apple",
    imageUrl:"/images/appleavatar2.jpg",
    description: "Fuller midsection, slimmer legs",
  },
];


export default function AvatarSelection() {
  const [selectedBodyType, setSelectedBodyType] = useState(null);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const navigate = useNavigate();

  const handleAvatarClick = (bodyType) => {
    setSelectedBodyType(bodyType);
    setShowWarningModal(true);
  };

  const handleWarningOkay = () => {
    setShowWarningModal(false);
    setShowConfirmation(true);
  };

  const handleYes = () => {
    if (!selectedBodyType) return;
    localStorage.setItem("bodyType", selectedBodyType);
    navigate("/recommendations");
  };

  const handleNotNow = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Logo */}
      <div className="px-7 py-4">
        <h1
          className="text-3xl font-bold text-purple-700 cursor-pointer"
          onClick={() => navigate("/")}
        >
          AssistMart
        </h1>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-8 py-12 text-center">
        <h1 className="mb-4 text-2xl font-semibold">Find Your Perfect Fit</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Choose the body type that feels most like you. This helps us personalize your clothing recommendations.
        </p>
      </div>

      {/* Avatar Grid */}
      <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
        {avatarData.map((avatar) => (
          <div
            key={avatar.id}
            onClick={() => handleAvatarClick(avatar.id)}
            className={`relative rounded-2xl shadow-md p-6 cursor-pointer transition-all hover:scale-105 hover:shadow-xl ${
              selectedBodyType === avatar.id
                ? "border-4 border-purple-700"
                : "border-2 border-transparent"
            }`}
          >
            {selectedBodyType === avatar.id && (
              <div className="absolute top-4 right-4 bg-purple-700 rounded-full p-1">
                <Check className="w-5 h-5 text-white" />
              </div>
            )}

            <div className="aspect-[3/4] mb-4 overflow-hidden rounded-lg bg-gray-100">
              <img
                src={avatar.imageUrl}
                alt={avatar.name}
                className="w-full h-full object-cover"
              />
            </div>

            <h3 className="font-semibold text-center">{avatar.name}</h3>
            <p className="text-sm text-gray-600 text-center">
              {avatar.description}
            </p>
          </div>


        ))}



         
      </div>

      

      {/* Warning Modal */}
      {showWarningModal && (
        <Modal onClose={() => setShowWarningModal(false)}>
          <p className="text-gray-600 mb-6 text-center">
            Changing your body type may update your recommended clothing suggestions.
          </p>
          <button
            onClick={handleWarningOkay}
            className="bg-purple-700 text-white px-8 py-3 rounded-full"
          >
            Okay, noted
          </button>
        </Modal>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <Modal onClose={() => setShowConfirmation(false)}>
          <h3 className="text-purple-700 font-semibold mb-4">
            Body Type Selected!
          </h3>
          <p className="text-gray-600 mb-6">
            Would you like to see clothes recommended for your body type?
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={handleYes}
              className="bg-purple-700 text-white px-8 py-3 rounded-full"
            >
              Yes
            </button>
            <button
              onClick={handleNotNow}
              className="border-2 border-purple-700 text-purple-700 px-8 py-3 rounded-full"
            >
              Not right now
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose }) {
  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl max-w-lg w-full p-8 text-center relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400"
          >
            <X />
          </button>
          {children}
        </div>
      </div>
    </>
  );
}
