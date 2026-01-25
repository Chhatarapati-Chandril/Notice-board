// src/components/AppBox.jsx
import React from "react";

function AppBox({ title, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white p-6 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-200 flex items-center justify-center font-bold text-xl text-gray-800"
    >
      {title}
    </div>
  );
}

export default AppBox;
