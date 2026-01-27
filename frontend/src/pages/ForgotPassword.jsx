import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import FootNav from "../components/FootNav";
import api from "../redux/api";
import { forgotPassword, resetPassword } from "../redux/authapi";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [role, setRole] = useState("STUDENT"); // student | professor
  const [username, setUsername] = useState(""); // roll_no | email
  const [otp, setOtp] = useState("");
  const [resetToken, setResetToken] = useState(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // =========================
  // STEP 1: SEND OTP
  // =========================
  const handleStep1 = async (e) => {
    e.preventDefault();

    try {
      if (role === "STUDENT") {
        await forgotPassword({
          role: "STUDENT",
          roll_no: username,
        });
      } else {
        await forgotPassword({
          role: "PROFESSOR",
          email: username,
        });
      }

      setStep(2);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP");
    }
  };

  // =========================
  // STEP 2: VERIFY OTP
  // =========================
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

  // =========================
  // STEP 3: RESET PASSWORD
  // =========================
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
    <div className="min-h-screen bg-[#2f343a] relative overflow-hidden">
      <Nav />

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-[120%] -translate-y-[95%] w-72 h-72 bg-blue-500/50 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 translate-x-[20%] translate-y-[20%] w-72 h-72 bg-orange-500/50 rounded-full blur-[120px]" />

      <div className="flex items-center justify-center min-h-screen pt-20 px-4">
        <div className="bg-[#3a3f45] w-full max-w-sm rounded-xl shadow-2xl p-6 text-gray-200 z-10">
          <h2 className="text-xl font-semibold text-center mb-4">
            Forgot Password
          </h2>

          <p className="text-center text-xs text-gray-400 mb-4">
            Step {step} of 3
          </p>

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleStep1} className="space-y-4">
              <div className="flex justify-center gap-4">
                <label
                  className={`px-4 py-2 rounded-lg border cursor-pointer ${role === "STUDENT" ? "border-blue-500" : "border-gray-500"}`}
                >
                  <input
                    type="radio"
                    checked={role === "STUDENT"}
                    onChange={() => {
                      setRole("STUDENT");
                      setUsername("");
                    }}
                    className="mr-2"
                  />
                  Student
                </label>

                <label
                  className={`px-4 py-2 rounded-lg border cursor-pointer ${role === "PROFESSOR" ? "border-blue-500" : "border-gray-500"}`}
                >
                  <input
                    type="radio"
                    checked={role === "PROFESSOR"}
                    onChange={() => {
                      setRole("PROFESSOR");
                      setUsername("");
                    }}
                    className="mr-2"
                  />
                  Professor
                </label>
              </div>

              <div>
                <label className="text-sm">
                  {role === "STUDENT" ? "Roll No" : "Email"}
                </label>
                <input
                  type={role === "STUDENT" ? "text" : "email"}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-[#4a5057] rounded-md"
                  required
                />
              </div>

              <button className="w-full bg-gray-200 text-gray-900 py-2 rounded-md">
                Send OTP
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={handleStep2} className="space-y-4">
              <div>
                <label className="text-sm">OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-[#4a5057] rounded-md"
                  required
                />
              </div>

              <button className="w-full bg-gray-200 text-gray-900 py-2 rounded-md">
                Verify OTP
              </button>
            </form>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <form onSubmit={handleStep3} className="space-y-4">
              <div className="relative">
                <label className="text-sm">New Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-[#4a5057] rounded-md"
                  required
                />
                <span
                  className="absolute right-3 top-9 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <div className="relative">
                <label className="text-sm">Confirm Password</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-[#4a5057] rounded-md"
                  required
                />
                <span
                  className="absolute right-3 top-9 cursor-pointer"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>

              <button className="w-full bg-gray-200 text-gray-900 py-2 rounded-md">
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
