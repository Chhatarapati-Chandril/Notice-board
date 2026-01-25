import React from "react";
import logo from "../assets/logo.png";
import ProfileMenu from "./ProfileMenu";

export default function HomeNav({ title = "Our Portal", subtitle }) {
  return (
    <nav className="w-full bg-[#3a3f45] shadow-lg fixed top-0 z-20 border-b border-white/5">
      <div className="flex justify-between items-center h-20 px-4">

        {/* LEFT: Logo + Dynamic Title */}
        <div className="flex items-center">
          <img
            className="h-12 w-12 object-contain"
            src={logo}
            alt="College Logo"
          />

          <div className="hidden sm:flex items-center ml-3">
            <div className="mx-2 h-10 w-px bg-white/20 rounded-full"></div>

            <div className="flex flex-col leading-tight">
              <h1 className="text-red-500 text-xl font-serif tracking-wide uppercase">
                {title}
              </h1>

              {subtitle && (
                <span className="text-gray-400 text-sm font-sans">
                  {subtitle}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <ProfileMenu />
      </div>
    </nav>
  );
}
