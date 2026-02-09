import React, { useState } from "react";
import HomeNav from "../components/HomeNav";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../redux/api";

export default function AdminChangePassword() {
  const { role } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    curr_password: "",
    admin_secret: "",
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

    const {
      curr_password,
      admin_secret,
      new_password,
      confirm_password,
    } = form;

    // ✅ Frontend validations
    if (!curr_password || !admin_secret || !new_password || !confirm_password) {
      alert("All fields are required");
      return;
    }

    if (new_password !== confirm_password) {
      alert("New password and confirm password do not match");
      return;
    }

    if (curr_password === new_password) {
      alert("New password must be different from current password");
      return;
    }

    setLoading(true);

    try {
      const res = await api.patch(
        "/auth/admin/change-password",
        {
          curr_password,
          admin_secret,
          new_password,
        },
        { withCredentials: true }
      );

      alert(res.data.message || "Password changed successfully");

      // ✅ Reset form
      setForm({
        curr_password: "",
        admin_secret: "",
        new_password: "",
        confirm_password: "",
      });

      // ✅ Redirect admin to home after success
      navigate("/home", { replace: true });

    } catch (err) {
      if (err.response?.status === 401) {
        alert("Current password or admin secret is incorrect");
      } else if (err.response?.status === 400) {
        alert(err.response.data.message || "Invalid password");
      } else {
        alert("Failed to change password. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // 🚫 Role guard
  if (role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f3f5f9]">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-gray-600">
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
        <div className="bg-white p-10 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold text-[#1e5aa8] mb-6 text-center">
            Change Password
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Current Password */}
            <div>
              <label className="block text-gray-600 mb-1 font-medium">
                Current Password
              </label>
              <input
                type="password"
                name="curr_password"
                value={form.curr_password}
                onChange={handleChange}
                className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Admin Secret */}
            <div>
              <label className="block text-gray-600 mb-1 font-medium">
                Admin Secret
              </label>
              <input
                type="password"
                name="admin_secret"
                value={form.admin_secret}
                onChange={handleChange}
                className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-gray-600 mb-1 font-medium">
                New Password
              </label>
              <input
                type="password"
                name="new_password"
                value={form.new_password}
                onChange={handleChange}
                className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-200"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-gray-600 mb-1 font-medium">
                Confirm New Password
              </label>
              <input
                type="password"
                name="confirm_password"
                value={form.confirm_password}
                onChange={handleChange}
                className="w-full border px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1e5aa8] text-white py-3 rounded-lg hover:bg-[#174a8a] disabled:opacity-50"
            >
              {loading ? "Updating…" : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}