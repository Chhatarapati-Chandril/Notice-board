import React from "react";
import logo from "../assets/logo.png";

export default function Nav() {
  return (
    <nav className="w-full bg-[#3a3f45] shadow-lg fixed top-0 z-20 border-b border-white/5">
      <div className="flex justify-between items-center h-20">

        {/* Left: Logo + (responsive text) */}
        <div className="flex ml-2 items-center">

          {/* Website Logo (always visible) */}
          <img
            className="h-12 w-12 object-contain"
            src="https://channeli.in/branding/site/logo.svg"
            alt="Website Logo"
          />

          {/* Divider + Text (hidden on small screens) */}
          <div className="hidden sm:flex items-center ml-3">
            <div className="mx-2 h-10 w-px bg-white/20 rounded-full"></div>

            <div className="flex flex-col leading-tight">
              <h1 className="text-red-500 text-xl font-serif tracking-wide">
                Our Portal
              </h1>
              <span className="text-gray-400 text-sm font-sans">
                One true intranet portal of IITSNP
              </span>
            </div>
          </div>
        </div>

        {/* Right: College Logo (always visible) */}
        <div className="flex mr-2 items-center">
          <img
            className="h-14 w-14 object-contain"
            src={logo}
            alt="College Logo"
          />
        </div>

      </div>
    </nav>
  );
}
