import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import HomeNav from "../components/HomeNav";
import AppBox from "../components/AppBox";
import FloatingButton from "../components/FloatingButton";

function Home() {
  const role = useSelector((state) => state.auth.role);
  const navigate = useNavigate();

  const handleNoticeClick = () => {
    navigate("/noticeboard");
  };

  const handlePostClick = () => {
    navigate("/post-notice");
  };

  return (
    <>
      {/* NAV FOR LOGGED-IN USERS */}
      <HomeNav />

      {/* PAGE LAYOUT */}
      <div className="flex h-screen bg-[#46494A] pt-20">
        {/* Sidebar */}
        <div className="w-64 bg-[#6a767b] text-white p-5 flex flex-col">
          <h2 className="text-2xl font-bold mb-6">My Portal</h2>

          {/* Apps (static, non-clickable) */}
          <div className="p-3 bg-gray-700 rounded mb-4 cursor-default">
            Apps
          </div>
        </div>

       {/* Main content */}
<div className="flex-1 p-10">
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mt-40 ">
    
    {/* Notice Board */}
    <AppBox
      title="Noticeboard"
      subtitle="A digital e-noticeboard"
      icon="📌"
      onClick={handleNoticeClick}
    />

    {/* Dummy apps */}
    <AppBox
      title="Lost & Found"
      subtitle="Find and report lost items"
      icon="📦"
      disabled
    />

    <AppBox
      title="People Search"
      subtitle="Search people in campus"
      icon="👤"
      disabled
    />

    <AppBox
      title="Forms"
      subtitle="Institute forms & requests"
      icon="📝"
      disabled
    />

    <AppBox
      title="Store"
      subtitle="Campus store"
      icon="🛒"
      disabled
    />

    <AppBox
      title="Drive"
      subtitle="Shared institute drive"
      icon="📁"
      disabled
    />
  </div>

  {role === "PROFESSOR" && (
    <FloatingButton onClick={handlePostClick} />
  )}
</div>

      </div>
    </>
  );
}

export default Home;
