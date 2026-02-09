import { FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Nav from "../components/Nav";
import FootNav from "../components/FootNav";

import api from "../redux/api";
import { forgotPassword, resetPassword } from "../redux/authapi";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [role, setRole] = useState("STUDENT");
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // STEP 1
  const handleStep1 = async (e) => {
    e.preventDefault();
    try {
      if (role === "STUDENT") {
        await forgotPassword({ role: "STUDENT", roll_no: username });
      } else {
        await forgotPassword({ role: "PROFESSOR", email: username });
      }
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  };

  // STEP 2
  const handleStep2 = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/verify-otp", { otp });
      setResetToken(res.data.data.reset_token);
      setStep(3);
    } catch (err) {
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  // STEP 3
  const handleStep3 = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }

    try {
      await resetPassword({
        reset_token: resetToken,
        new_password: newPassword,
      });
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f3f5f9] to-[#e9edf5]">
      <Nav />

      <div className="flex items-center justify-center min-h-[calc(100vh-120px)] px-4 pt-20">
        <div className="w-full max-w-sm bg-white shadow-[0_10px_30px_rgba(30,90,168,0.15)] p-6">
          
          {/* Heading */}
          <h2 className="flex items-center justify-center gap-2 text-2xl font-semibold text-[#0f2a44] mb-2">
            Forgot Password
          </h2>

          <p className="text-center text-sm text-gray-500 mb-6">
            Step {step} of 3
          </p>

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-4">
              <div className="flex justify-center gap-3">
                {["STUDENT", "PROFESSOR"].map((r) => (
                  <label
                    key={r}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer border text-sm font-medium transition
                    ${
                      role === r
                        ? "border-[#1e5aa8] bg-[#eef3fb] text-[#1e5aa8]"
                        : "border-gray-300 text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="radio"
                      checked={role === r}
                      onChange={() => {
                        setRole(r);
                        setUsername("");
                      }}
                      className="accent-[#1e5aa8]"
                    />
                    {r}
                  </label>
                ))}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  {role === "STUDENT" ? "Roll Number" : "Email"}
                </label>
                <input
                  type={role === "STUDENT" ? "text" : "email"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1e5aa8] focus:outline-none"
                  required
                />
              </div>

              <button className="w-full bg-[#1e5aa8] text-white py-2 rounded-lg font-medium hover:bg-[#174a8c] transition cursor-pointer">
                Send OTP
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={handleStep2} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1e5aa8] focus:outline-none"
                  required
                />
              </div>

              <button className="w-full cursor-pointer bg-[#1e5aa8] text-white py-2 rounded-lg font-medium hover:bg-[#174a8c] transition">
                Verify OTP
              </button>
            </form>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <form onSubmit={handleStep3} className="space-y-4">
              <div className="relative">
                <label className="text-sm font-medium text-gray-700">
                  New Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1e5aa8] focus:outline-none"
                  required
                />
                <span
                  className="absolute right-3 top-9 cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div className="relative">
                <label className="text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1e5aa8] focus:outline-none"
                  required
                />
                <span
                  className="absolute right-3 top-9 cursor-pointer text-gray-500"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button className="w-full bg-[#1e5aa8] cursor-pointer text-white py-2 rounded-lg font-medium hover:bg-[#174a8c] transition">
                Reset Password
              </button>
            </form>
          )}
        </div>
      </div>

      {/* <FootNav /> */}
    </div>
  );
}
