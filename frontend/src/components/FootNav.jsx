import React from "react";

export default function FootNav() {
  return (
    <footer className="w-full bg-[#3a3f45] shadow-inner fixed bottom-0 z-10 border-t border-white/5">
      <div className="flex justify-between items-center h-12 px-4 sm:px-6 lg:px-8">

        {/* Left: Year + Logo + Text */}
        <div className="flex items-center gap-2 text-gray-300">

          <span className="text-xs tracking-wider font-mono text-gray-400">
            © 2026
          </span>

          <img
            className="h-7 w-7 object-contain opacity-90"
            src="https://channeli.in/branding/maintainers/favicon.ico"
            alt="IMG Logo"
          />

          <span className="text-xs font-serif tracking-wide text-gray-300">
            Information Management Group
          </span>
        </div>

        {/* Right: Powered By */}
        <div className="flex items-center gap-2">

          <span className="text-xs uppercase tracking-widest font-mono text-gray-400">
            Powered by
          </span>

          <img
            className="h-7 w-7 object-contain opacity-90"
            src="https://omniport.readthedocs.io/en/latest/_static/favicon.ico"
            alt="Omniport Logo"
          />

          <a
            href="https://omniport.readthedocs.io"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-serif tracking-wide text-blue-400 hover:text-blue-300 transition"
          >
            Omniport
          </a>
        </div>

      </div>
    </footer>
  );
}
