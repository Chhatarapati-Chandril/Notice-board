// src/components/Sidebar.jsx
import React from "react";

function Sidebar({ options, selected, setSelected }) {
  return (
    <div className="w-64 bg-gray-800 text-white h-full p-5">
      <h2 className="text-2xl font-bold mb-6">My Portal</h2>
      <div className="flex flex-col gap-2">
        {options.map((item) => (
          <div
            key={item.name}
            onClick={() => setSelected(item.name)}
            className={`cursor-pointer p-2 rounded ${
              selected === item.name ? "bg-gray-700" : "hover:bg-gray-700"
            }`}
          >
            {item.name}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;
