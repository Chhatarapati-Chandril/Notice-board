import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import FootNav from "../components/FootNav";
import { forgotPassword, resetPassword } from "../redux/authapi";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [role, setRole] = useState("student"); // NEW: student or professor
  const [username, setUsername] = useState(""); // RollNo or Email
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // STEP 1: Send OTP
  const handleStep1 = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword({ username });
      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  };

  // STEP 2: Verify OTP
  const handleStep2 = (e) => {
    e.preventDefault();
    setStep(3);
  };

  // STEP 3: Reset Password
  const handleStep3 = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }
    try {
      await resetPassword({ username, otp, newPassword });
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#2f343a] relative overflow-hidden">
      <Nav />

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-[120%] -translate-y-[95%] w-72 h-72 sm:w-80 sm:h-80 lg:w-115 lg:h-115 bg-blue-500/50 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 translate-x-[20%] translate-y-[20%] w-72 h-72 sm:w-80 sm:h-80 lg:w-115 lg:h-115 bg-orange-500/50 rounded-full blur-[120px]" />

      {/* Card */}
      <div className="flex items-center justify-center min-h-screen pt-20 px-4">
        <div className="bg-[#3a3f45] w-full max-w-xs sm:max-w-sm rounded-xl shadow-2xl p-5 sm:p-6 text-gray-200 z-10">

          <h2 className="text-lg sm:text-xl font-semibold text-center mb-5">
            Forgot Password
          </h2>

          <p className="text-center text-xs text-gray-400 mb-4">
            Step {step} of 3
          </p>

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-4">

              {/* Role Selection */}
              <div className="flex justify-center gap-4 mb-4">
                <label className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer border transition ${role === "student" ? "border-blue-500 bg-blue-500/10" : "border-gray-500/40 hover:border-gray-400"}`}>
                  <input
                    type="radio"
                    name="role"
                    value="student"
                    checked={role === "student"}
                    onChange={() => { setRole("student"); setUsername(""); }}
                    className="w-5 h-5 accent-blue-500 cursor-pointer"
                  />
                  <span className="text-sm sm:text-base">Student</span>
                </label>

                <label className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer border transition ${role === "professor" ? "border-blue-500 bg-blue-500/10" : "border-gray-500/40 hover:border-gray-400"}`}>
                  <input
                    type="radio"
                    name="role"
                    value="professor"
                    checked={role === "professor"}
                    onChange={() => { setRole("professor"); setUsername(""); }}
                    className="w-5 h-5 accent-blue-500 cursor-pointer"
                  />
                  <span className="text-sm sm:text-base">Professor</span>
                </label>
              </div>

              {/* Input Field */}
              <div>
                <label className="text-sm text-gray-300">
                  {role === "student" ? "Roll No" : "Email"}
                </label>
                <input
                  type={role === "student" ? "text" : "email"}
                  placeholder={role === "student" ? "Enter Roll Number" : "Enter Email"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-[#4a5057] rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gray-300 text-gray-900 font-semibold py-2 rounded-md hover:bg-gray-200 transition"
              >
                Send OTP
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={handleStep2} className="space-y-4">
              <div>
                <label className="text-sm text-gray-300">OTP</label>
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-[#4a5057] rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gray-300 text-gray-900 font-semibold py-2 rounded-md hover:bg-gray-200 transition"
              >
                Verify OTP
              </button>
            </form>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <form onSubmit={handleStep3} className="space-y-4">

              {/* New Password */}
              <div className="relative">
                <label className="text-sm text-gray-300">New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-[#4a5057] rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span
                  className="absolute right-3 top-9 cursor-pointer text-gray-300"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <label className="text-sm text-gray-300">Confirm Password</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-[#4a5057] rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                />
                <span
                  className="absolute right-3 top-9 cursor-pointer text-gray-300"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button
                type="submit"
                className="w-full bg-gray-300 text-gray-900 font-semibold py-2 rounded-md hover:bg-gray-200 transition"
              >
                Reset Password
              </button>
            </form>
          )}

        </div>
      </div>

      <FootNav />
    </div>
  );
}
