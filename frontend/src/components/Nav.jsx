import React from "react";
import logo from "../assets/logo.png";

export default function Nav() {
  return (
    <nav className="w-full bg-[#0f2a44] fixed top-0 z-20 shadow-sm">
      <div className="flex justify-between items-center h-20 px-4">

        <div className="flex items-center">
          <img
            className="h-12 w-12"
            src="https://channeli.in/branding/site/logo.svg"
            alt="Portal Logo"
          />

          <div className="hidden sm:flex items-center ml-3">
            <div className="mx-3 h-10 w-px bg-white/30"></div>
            <div>
              <h1 className="text-white text-xl font-semibold">
                Our Portal
              </h1>
              <p className="text-gray-300 text-sm">
                Official Notice Board of IITSNP
              </p>
            </div>
          </div>
        </div>

        <img className="h-14 w-14" src={logo} alt="College Logo" />
      </div>
    </nav>
  );
}
