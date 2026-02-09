// src/components/FloatingButton.jsx
import React from "react";

function FloatingButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="
        fixed bottom-8 right-8
        w-14 h-14
        bg-linear-to-br from-blue-500 to-indigo-600
        text-white text-3xl
        font-bold
        rounded-full
        shadow-lg
        flex items-center justify-center
        hover:scale-110 hover:shadow-2xl
        transition-transform duration-300
        focus:outline-none cursor-pointer
      "
      title="Post Notice"
    >
      <span className="transform -translate-y-0.5">+</span>
    </button>
  );
}

export default FloatingButton;
