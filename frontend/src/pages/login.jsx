import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import FootNav from "../components/FootNav";
import { useDispatch } from "react-redux";
import { authStart, loginSuccess, authFailure } from "../redux/authslice";
import { studentLogin, professorLogin } from "../redux/authapi";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [role, setRole] = useState("student");

  const [rollNo, setRollNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

const handleSubmit = async (e) => {
  e.preventDefault();
  dispatch(authStart());

  try {
    let res;

    if (role === "student") {
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

    dispatch(
      loginSuccess({
        token: res.data.data.accessToken,
        role: role === "student" ? "STUDENT" : "PROFESSOR",
      })
    );

    navigate("/home");
  } catch (err) {
    dispatch(
      authFailure(
        err.response?.data?.message || "Login failed"
      )
    );
  }
};


  return (
    <div className="min-h-screen bg-[#2f343a] relative overflow-hidden">
      <Nav />

      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-[120%] -translate-y-[95%] w-72 h-72 sm:w-80 sm:h-80 lg:w-115 lg:h-115 bg-blue-500/50 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 translate-x-[20%] translate-y-[20%] w-72 h-72 sm:w-80 sm:h-80 lg:w-115 lg:h-115 bg-orange-500/50 rounded-full blur-[120px]" />

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
      ${role === "student"
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-500/40 hover:border-gray-400"
                }`}
            >
              <input
                type="radio"
                name="role"
                value="student"
                checked={role === "student"}
                onChange={() => setRole("student")}
                className="w-5 h-5 accent-blue-500 cursor-pointer"
              />
              <span className="text-sm sm:text-base">Student</span>
            </label>

            <label
              className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer border transition
      ${role === "professor"
                  ? "border-blue-500 bg-blue-500/10"
                  : "border-gray-500/40 hover:border-gray-400"
                }`}
            >
              <input
                type="radio"
                name="role"
                value="professor"
                checked={role === "professor"}
                onChange={() => setRole("professor")}
                className="w-5 h-5 accent-blue-500 cursor-pointer"
              />
              <span className="text-sm sm:text-base">Professor</span>
            </label>
          </div>


          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Student Fields */}
            {role === "student" && (
              <div>
                <label className="text-sm text-gray-300">Roll No</label>
                <input
                  type="text"
                  placeholder="Enter Roll Number"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-[#4a5057] rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Professor Fields */}
            {role === "professor" && (
              <div>
                <label className="text-sm text-gray-300">Email</label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 px-3 py-2 bg-[#4a5057] rounded-md outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}

            {/* Password */}
            <div className="relative">
              <label className="text-sm text-gray-300">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-3 py-2 bg-[#4a5057] rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              />

              <span
                className="absolute right-3 top-9 cursor-pointer text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-gray-300 text-gray-900 font-semibold py-2 rounded-md hover:bg-gray-200 transition"
            >
              Log in
            </button>

            {/* Guest */}
            <button
              type="button"
              className="w-full border border-gray-400 text-gray-300 py-2 rounded-md hover:bg-gray-700/40 transition"
            >
              View as Guest
            </button>

            {/* Forgot */}
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
