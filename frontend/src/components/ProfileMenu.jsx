import React, { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../redux/api";
import { logout } from "../redux/authslice";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    try {
      // backend logout (clears refresh token cookie)
      await api.post("/auth/logout");
    } catch (err) {
      console.error("Logout API error", err);
    } finally {
      // always clear frontend state
      dispatch(logout());
      navigate("/login");
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar */}
      <div
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold cursor-pointer hover:scale-105 transition"
      >
        U
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-36 bg-[#3a3f45] rounded-lg shadow-xl border border-gray-600 overflow-hidden z-50">
          <button
            onClick={() => {
              navigate("/home");
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-600 transition cursor-pointer"
          >
            Home
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10 transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
