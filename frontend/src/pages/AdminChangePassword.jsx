// src/pages/AdminChangePassword.jsx
import React, { useState } from "react";
import HomeNav from "../components/HomeNav";
import { useSelector, useDispatch } from "react-redux";
import axios from "../redux/api";
import { loginSuccess } from "../redux/authslice";

export default function AdminChangePassword() {
  const { role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [form, setForm] = useState({
    curr_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.curr_password || !form.new_password || !form.confirm_password) {
      return alert("All fields are required");
    }

    if (form.new_password !== form.confirm_password) {
      return alert("New password and confirm password do not match");
    }

    setLoading(true);

    try {
      const res = await axios.post(
        "/auth/admin/change-password",
        {
          curr_password: form.curr_password,
          admin_secret:
            process.env.REACT_APP_ADMIN_SECRET ||
            "super-long-random-string-here",
          new_password: form.new_password,
        },
        { withCredentials: true }
      );

      alert(res.data.message || "Password changed successfully");

      // Update token in Redux
      if (res.data.data?.accessToken) {
        dispatch(
          loginSuccess({
            token: res.data.data.accessToken,
            role: "ADMIN",
            userIdentifier: "Admin",
          })
        );
      }

      setForm({ curr_password: "", new_password: "", confirm_password: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  if (role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f5f9]">
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200 text-center max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            Only Admin users can access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <HomeNav title="Admin Change Password" />

      <div className="flex justify-center pt-24 pb-12 bg-[#f3f5f9] min-h-screen">
        <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md border border-gray-200">
          <h2 className="text-3xl font-bold text-[#1e5aa8] mb-6 text-center">
            Change Password
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Current Password */}
            <div className="flex flex-col">
              <label className="text-gray-600 mb-2 font-medium">
                Current Password
              </label>
              <input
                type="password"
                name="curr_password"
                value={form.curr_password}
                onChange={handleChange}
                placeholder="Enter current password"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>

            {/* New Password */}
            <div className="flex flex-col">
              <label className="text-gray-600 mb-2 font-medium">
                New Password
              </label>
              <input
                type="password"
                name="new_password"
                value={form.new_password}
                onChange={handleChange}
                placeholder="Enter new password"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="flex flex-col">
              <label className="text-gray-600 mb-2 font-medium">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                placeholder="Confirm new password"
                className="w-full border border-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1e5aa8] text-white px-4 py-3 rounded-lg shadow hover:bg-[#174a8a] disabled:opacity-50 transition-colors duration-200"
            >
              {loading ? "Updating…" : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
