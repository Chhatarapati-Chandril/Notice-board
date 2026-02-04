import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { loginSuccess, authChecked} from "./redux/authslice";

import Login from "./pages/login";
import AdminLogin from "./pages/AdminLogin";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import NoticeBoard from "./pages/NoticeBoard";
import PostNotice from "./pages/PostNotice";
import Unauthorized from "./pages/Unauthorized";
import AdminChangePassword from "./pages/AdminChangePassword";
import UpdateNotice from "./pages/UpdateNotice";

const isTokenExpired = (token) => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, role } = useSelector(
    (state) => state.auth
  );

  // 🔐 Restore session SAFELY
  useEffect(() => {
    const stored = localStorage.getItem("auth");

    if (stored) {
      const parsed = JSON.parse(stored);

      if (parsed.token && !isTokenExpired(parsed.token)) {
        dispatch(loginSuccess(parsed));
      } else {
        dispatch(authChecked());
      }
    } else {
      dispatch(authChecked());
    }
  }, [dispatch]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-lg">
        Checking session…
      </div>
    );
  }

  return (
    <Routes>
      {/* ROOT */}
      <Route
  path="/"
  element={<Navigate to="/login" replace />}
/>

      {/* USER LOGIN */}
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/home" replace /> : <Login />
        }
      />

      {/* ADMIN LOGIN */}
      <Route
  path="/admin/login"
  element={<AdminLogin />}
/>

      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* HOME */}
      <Route
        path="/home/*"
        element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />}
      />

      {/* NOTICE BOARD */}
      <Route
        path="/noticeboard/*"
        element={
          isAuthenticated ? <NoticeBoard /> : <Navigate to="/login" replace />
        }
      />

      {/* POST NOTICE */}
      <Route
        path="/post-notice"
        element={
          role === "ADMIN" ? <PostNotice /> : <Navigate to="/unauthorized" replace />
        }
      />

      <Route
  path="/noticeboard/edit/:id"
  element={
    role === "ADMIN"
      ? <UpdateNotice />
      : <Navigate to="/unauthorized" replace />
  }
/>


      {/* ADMIN CHANGE PASSWORD */}
      <Route
        path="/admin/change-password"
        element={
          role === "ADMIN"
            ? <AdminChangePassword />
            : <Navigate to="/unauthorized" replace />
        }
      />

      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;