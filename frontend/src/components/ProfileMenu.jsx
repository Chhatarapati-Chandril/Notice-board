import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../redux/api";
import { logout } from "../redux/authslice";

export default function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { role, userIdentifier } = useSelector((state) => state.auth);
  console.log(role, userIdentifier);

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
      await api.post("/auth/logout");
    } catch (err) {
      console.error(err);
    } finally {
      dispatch(logout());
      navigate("/login");
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <div
        onClick={() => setOpen(!open)}
        className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold cursor-pointer"
      >
        {(role === "STUDENT") ? "S" : "P"}
      </div>

      {open && (
        <div className="absolute right-0 mt-2 w-56 bg-[#3a3f45] rounded-lg shadow-xl border border-gray-600 z-50">

          {/* USER INFO */}
          <div className="px-4 py-3 border-b border-gray-600">
            <p className="text-xs text-gray-400">
              {role === "STUDENT" ? "Student Roll No" : "Professor Email"}
            </p>
            <p className="text-sm font-semibold text-gray-200 break-all">
              {userIdentifier}
            </p>
          </div>

          <button
            onClick={() => {
              navigate("/home");
              setOpen(false);
            }}
            className="w-full text-left px-4 py-2 text-gray-200 hover:bg-gray-600"
          >
            Home
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/10"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}