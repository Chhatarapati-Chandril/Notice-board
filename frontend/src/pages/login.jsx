import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { FaLock } from "react-icons/fa";

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

    if (role === "STUDENT" && (!rollNo.trim() || !password.trim())) {
      alert("Please enter Roll Number and Password");
      return;
    }

    if (role === "PROFESSOR" && (!email.trim() || !password.trim())) {
      alert("Please enter Email and Password");
      return;
    }

    try {
      let res;

      if (role === "STUDENT") {
        res = await studentLogin({ roll_no: rollNo, password });
      } else {
        res = await professorLogin({ email, password });
      }

      const authData = {
        token: res.data.data.accessToken,
        role,
        userIdentifier: role === "STUDENT" ? rollNo : email,
      };

      localStorage.setItem("auth", JSON.stringify(authData));
      dispatch(loginSuccess(authData));
      navigate("/home");
    } catch (err) {
      alert(err.response?.data?.message || "Invalid credentials");
    }
  };

  const handleGuestLogin = () => {
    localStorage.setItem("auth", JSON.stringify({ role: "GUEST" }));
    navigate("/home");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-[#f3f5f9] to-[#e9edf5]">
      <Nav />

      <div className="flex items-center pt-34 justify-center min-h-[calc(100vh-120px)] px-4">
        <div className="w-full max-w-sm  bg-white shadow-[0_10px_30px_rgba(30,90,168,0.15)] p-6">
          <h2 className="flex items-center justify-center gap-2 text-2xl font-semibold text-center mb-6 text-[#0f2a44]">
  <FaLock className="text-[#1e5aa8]" />
  Login
</h2>

          {/* Role Selection */}
          <div className="flex justify-center gap-3 mb-6">
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
                  onChange={() => setRole(r)}
                  className="accent-[#1e5aa8]"
                />
                <span>{r}</span>
              </label>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {role === "STUDENT" && (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Roll Number
                </label>
                <input
                  type="text"
                  value={rollNo}
                  onChange={(e) => setRollNo(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1e5aa8] focus:outline-none"
                />
              </div>
            )}

            {role === "PROFESSOR" && (
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1e5aa8] focus:outline-none"
                />
              </div>
            )}

            <div className="relative">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-[#1e5aa8] focus:outline-none"
              />
              <span
                className="absolute right-3 top-9 cursor-pointer text-gray-500 hover:text-gray-700"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>

            <button
              type="submit"
              className="w-full cursor-pointer bg-[#1e5aa8] text-white py-2 rounded-lg font-medium hover:bg-[#174a8c] transition"
            >
              Login
            </button>

            <button
              type="button"
              onClick={handleGuestLogin}
              className="w-full border cursor-pointer border-gray-300 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
            >
              View as Guest
            </button>

            <div className="text-right">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-[#1e5aa8] hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* <FootNav /> */}
    </div>
  );
}
