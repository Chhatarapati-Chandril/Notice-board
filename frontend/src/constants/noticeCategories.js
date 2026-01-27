// src/constants/categoryColors.js

export const CATEGORY_COLORS = {
  "Examination Cell": "bg-red-100 text-red-700",
  "Training & Placement Cell": "bg-green-100 text-green-700",
  "Central Library": "bg-purple-100 text-purple-700",
  "Technical Society": "bg-indigo-100 text-indigo-700",
  "Sports Club": "bg-orange-100 text-orange-700",
  "Student Council": "bg-pink-100 text-pink-700",
  NSS: "bg-yellow-100 text-yellow-700",
  General: "bg-gray-100 text-gray-700",
};

export const getCategoryBadgeClass = (name) =>
  CATEGORY_COLORS[name] || "bg-gray-100 text-gray-700";
