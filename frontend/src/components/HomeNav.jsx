import React from "react";
import logo from "../assets/logo.png";
import ProfileMenu from "./ProfileMenu";

export default function HomeNav({ title = "Our Portal", subtitle = "Official Notice Board of IITSNP" }) {
  return (
    <nav className="w-full bg-[#0f2a44] fixed top-0 z-20 shadow-[0_10px_30px_rgba(30,90,168,0.15)]">
      <div className="flex justify-between items-center h-20 px-4">

        {/* LEFT */}
        <div className="flex items-center gap-3">
          <img
            className="h-12 w-12 object-contain"
            src={logo}
            alt="College Logo"
          />
          <div className="hidden sm:flex flex-col">
            <h1 className="text-white text-xl font-semibold">{title}</h1>
            <span className="text-gray-300 text-sm">{subtitle}</span>
          </div>
        </div>

        {/* RIGHT */}
        <ProfileMenu />
      </div>
    </nav>
  );
}
