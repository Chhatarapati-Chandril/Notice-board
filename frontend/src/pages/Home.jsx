import React from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import HomeNav from "../components/HomeNav";
import Sidebar from "../components/Sidebar";
import AppBox from "../components/AppBox";
import FloatingButton from "../components/FloatingButton";

function Home() {
  const role = useSelector((state) => state.auth.role);
  const navigate = useNavigate();

  const handleNoticeClick = () => navigate("/noticeboard");
  const handlePostClick = () => navigate("/post-notice");

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f3f5f9] to-[#e9edf5]">
      {/* NAV */}
      <HomeNav />

      {/* PAGE LAYOUT */}
      <div className="flex pt-19 min-h-[calc(100vh-80px)]">

        {/* SIDEBAR */}
        <Sidebar />

        {/* MAIN CONTENT */}
        <div className="flex-1 p-6 flex items-start">
 <div className="grid grid-cols-1 sm:grid-cols-2 pt-32 lg:grid-cols-3 gap-6 w-full">
            {/* Keep original AppBox size and spacing */}
            <AppBox
              title="Noticeboard"
              subtitle="A digital e-noticeboard"
              icon="📌"
              onClick={handleNoticeClick}
            />
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

          {/* FLOATING BUTTON FOR PROFESSOR */}
          {role === "PROFESSOR" && (
            <FloatingButton onClick={handlePostClick} />
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
