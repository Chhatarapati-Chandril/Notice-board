import React from "react";

function AppBox({ title, subtitle, icon, onClick, disabled }) {
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={`
        flex items-center gap-4
        px-5 py-6
        rounded-xl border
        transition-all duration-200
        ${
          disabled
            ? "bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200"
            : "bg-white cursor-pointer border-gray-200 hover:border-indigo-400 hover:shadow-md"
        }
      `}
    >
      {/* Icon */}
      <div
        className={`
          w-12 h-12 rounded-lg flex items-center justify-center text-xl font-bold
          ${disabled ? "bg-gray-200" : "bg-indigo-100 text-indigo-600"}
        `}
      >
        {icon}
      </div>

      {/* Text */}
      <div className="flex flex-col">
        <span className="font-semibold text-gray-800">
          {title}
        </span>
        <span className="text-sm text-gray-500">
          {subtitle}
        </span>
      </div>
    </div>
  );
}

export default AppBox;
