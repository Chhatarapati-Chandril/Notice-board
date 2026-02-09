import React from "react";

export default function FootNav() {
  return (
    <footer className="w-full bg-[#0f2a44] fixed bottom-0 border-t border-gray-300">
      <div className="flex justify-between items-center h-12 px-4 text-white text-xs">

        <div className="flex items-center gap-2">
          <span>© 2026</span>
          <span className="font-medium">
            Information Management Group
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="uppercase tracking-wider">Powered by</span>
          <a
            href="https://omniport.readthedocs.io"
            target="_blank"
            rel="noreferrer"
            className="text-orange-700 hover:underline"
          >
            Omniport
          </a>
        </div>

      </div>
    </footer>
  );
}
