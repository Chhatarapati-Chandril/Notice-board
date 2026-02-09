import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";

import Nav from "../components/Nav";
import api from "../redux/api";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authslice";

export default function AdminLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [adminSecret, setAdminSecret] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !adminSecret || !password) {
      return alert("All fields are required");
    }

    try {
      const res = await api.post(
        "/auth/admin/login",
        {
          email,
          admin_secret: adminSecret,
          password,
        },
        { withCredentials: true }
      );

      const authData = {
        role: "ADMIN",
      };

      localStorage.setItem("auth", JSON.stringify(authData));
      dispatch(loginSuccess(authData));
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.message || "Admin login failed");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f3f5f9] to-[#e9edf5]">
      <Nav />

      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] px-4">
        <div className="w-full max-w-sm bg-white shadow-lg p-6">
          <h2 className="flex items-center justify-center gap-2 text-2xl font-semibold mb-6">
            <FaLock /> Admin Login
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg"
            />

            <input
              type="password"
              placeholder="Admin Secret"
              value={adminSecret}
              onChange={(e) => setAdminSecret(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg"
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg"
              />
              <span
                className="absolute right-3 top-3 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button className="w-full cursor-pointer bg-[#1e5aa8] text-white py-2 rounded-lg">
              Login as Admin
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}