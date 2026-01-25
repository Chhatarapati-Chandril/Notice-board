// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AppBox from "../components/AppBox";
import ProfileMenu from "../components/ProfileMenu";
import FloatingButton from "../components/FloatingButton";

function Home() {
  const role = useSelector((state) => state.auth.role); // "student" or "professor"
  const navigate = useNavigate();

  // State for toggling apps
  const [showApps, setShowApps] = useState(true); // <-- default true to show immediately

  const handleNoticeClick = () => {
    navigate("/noticeboard");
  };

  const handlePostClick = () => {
    navigate("/post-notice");
  };

  return (
    <div className="flex h-screen bg-[#46494A]">
      {/* Sidebar */}
      <div className="w-64 bg-[#6a767b] text-white p-5 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">My Portal</h2>

        {/* Apps button (always visible) */}
        <div
          onClick={() => setShowApps(!showApps)}
          className="cursor-pointer p-3 bg-gray-700 rounded hover:bg-gray-600 mb-4"
        >
          Apps
        </div>
      </div>

      {/* Main content */}
     {/* Main content */}
<div className="flex-1 p-8 relative">

  {/* 🔵 Top Right Profile Menu */}
  <div className="absolute top-6 right-8 z-50">
    <ProfileMenu />
  </div>

  {/* Apps cards */}
  {showApps && (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-14">
      <AppBox title="Notice Board" onClick={handleNoticeClick} />
    </div>
  )}

  {/* Professor floating button */}
  {role === "professor" && <FloatingButton onClick={handlePostClick} />}
</div>

    </div>
  );
}

export default Home;
