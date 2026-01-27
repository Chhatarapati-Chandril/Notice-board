import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import Nav from "../components/Nav";
import FootNav from "../components/FootNav";

import { loginSuccess } from "../redux/authslice";
import { studentLogin, professorLogin } from "../redux/authapi";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [role, setRole] = useState("STUDENT");

  const [rollNo, setRollNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ CLIENT-SIDE VALIDATION
    if (role === "STUDENT" && (!rollNo.trim() || !password.trim())) {
      alert("❌ Please enter Roll Number and Password");
      return;
    }

    if (role === "PROFESSOR" && (!email.trim() || !password.trim())) {
      alert("❌ Please enter Email and Password");
      return;
    }

    try {
      let res;

      if (role === "STUDENT") {
        res = await studentLogin({
          roll_no: rollNo,
          password,
        });
      } else {
        res = await professorLogin({
          email,
          password,
        });
      }

      // ✅ SAVE AUTH STATE
      const authData = {
        token: res.data.data.accessToken,
        role,
        userIdentifier: role === "STUDENT" ? rollNo : email,
      };

      localStorage.setItem("auth", JSON.stringify(authData));
      dispatch(loginSuccess(authData));
      

      navigate("/home");
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "❌ Invalid credentials";

      alert(errorMessage);
    }
  };

  return (
    <div className="min-h-screen bg-[#2f343a] relative overflow-hidden">
      <Nav />

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-[120%] -translate-y-[95%] w-72 h-72 sm:w-80 sm:h-80 bg-blue-500/50 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 translate-x-[20%] translate-y-[20%] w-72 h-72 sm:w-80 sm:h-80 bg-orange-500/50 rounded-full blur-[120px]" />

      {/* Login Card */}
      <div className="flex items-center justify-center min-h-screen pt-20 px-4">
        <div className="bg-[#3a3f45] w-full max-w-xs sm:max-w-sm rounded-xl shadow-2xl p-5 sm:p-6 text-gray-200 z-10">
          <h2 className="text-lg sm:text-xl font-semibold text-center mb-4 flex items-center justify-center gap-2">
            <span>🔒</span> Login
          </h2>

          {/* Role Selection */}
          <div className="flex justify-center gap-4 mb-5">
            <label
              className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer border transition
              ${
                role === "STUDENT"
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-500/40 hover:border-gray-400"
              }`}
            >
              <input
                type="radio"
                checked={role === "STUDENT"}
                onChange={() => setRole("STUDENT")}
                className="w-5 h-5 accent-blue-500"
              />
              <span>Student</span>
            </label>

            <label
              className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer border transition
              ${
                role === "PROFESSOR"
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-500/40 hover:border-gray-400"
              }`}
            >
              <input
                type="radio"
                checked={role === "PROFESSOR"}
                onChange={() => setRole("PROFESSOR")}
                className="w-5 h-5 accent-blue-500"
              />
              <span>Professor</span>
            </label>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Student */}
            {role === "STUDENT" && (
              <div>
                <label className="text-sm">Roll No</label>
                <input
                  type="text"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-[#4a5057] rounded-md"
                />
              </div>
            )}

            {/* Professor */}
            {role === "PROFESSOR" && (
              <div>
                <label className="text-sm">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-[#4a5057] rounded-md"
                />
              </div>
            )}

            {/* Password */}
            <div className="relative">
              <label className="text-sm">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-[#4a5057] rounded-md"
              />
              <span
                className="absolute right-3 top-9 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button
              type="submit"
              className="w-full bg-gray-300 text-gray-900 font-semibold py-2 rounded-md cursor-pointer"
            >
              Log in
            </button>

            <div className="text-right">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-blue-400 hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          </form>
        </div>
      </div>

      <FootNav />
    </div>
  );
}