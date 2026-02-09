import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../redux/api"; // Make sure this is your axios instance
import { logout } from "../redux/authslice";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { role, userIdentifier } = useSelector((state) => state.auth);

  // Close menu when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ✅ Logout handler
 const handleLogout = async () => {
  const currentRole = role;

  try {
    await api.post("/auth/logout", {}, { withCredentials: true });
  } catch (err) {
    console.error("Logout API failed", err);
  } finally {
    dispatch(logout());

    if (currentRole === "ADMIN") {
      window.location.href = "/admin/login";
    } else {
      window.location.href = "/login";
    }
  }
};


  return (
    <div className="relative" ref={menuRef}>
      {/* Avatar */}
      <div
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold cursor-pointer"
      >
        {role === "STUDENT" ? "S" : role === "PROFESSOR" ? "P" : role === "ADMIN" ? "A" : "G"}
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-[#3a3f45] rounded-lg shadow-xl border border-gray-600 z-50">
          {/* USER INFO */}
          <div className="px-4 py-3 border-b border-gray-600">
            <p className="text-xs text-gray-400">
              {role === "STUDENT"
                ? "Student Roll No"
                : role === "PROFESSOR"
                ? "Professor Email"
                : role === "ADMIN"
                ? "Admin Email"
                : "Guest User"}
            </p>
            <p className="text-sm font-semibold text-gray-200 break-all">
              {userIdentifier || "Read-only access"}
            </p>
          </div>

          {/* HOME */}
          <button
            onClick={() => {
              navigate("/home");
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 cursor-pointer text-gray-200 hover:bg-gray-600"
          >
            Home
          </button>

          {/* CHANGE PASSWORD (Admin Only) */}
          {role === "ADMIN" && (
            <button
              onClick={() => {
                navigate("/admin/change-password");
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 cursor-pointer text-gray-200 hover:bg-gray-600"
            >
              Change Password
            </button>
          )}

          {/* LOGOUT */}
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 cursor-pointer text-red-400 hover:bg-red-500/10"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}