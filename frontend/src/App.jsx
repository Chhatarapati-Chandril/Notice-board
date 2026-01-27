import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { loginSuccess, authChecked } from "./redux/authslice";

import Login from "./pages/login";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import NoticeBoard from "./pages/NoticeBoard";
import PostNotice from "./pages/PostNotice";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading, role } = useSelector(
    (state) => state.auth
  );

  // ✅ Restore session from localStorage (STUDENT / PROFESSOR / GUEST)
  useEffect(() => {
    const storedAuth = localStorage.getItem("auth");

    if (storedAuth) {
      dispatch(loginSuccess(JSON.parse(storedAuth)));
    } else {
      dispatch(authChecked());
    }
  }, [dispatch]);

  // ⏳ Wait until auth is resolved
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
        element={
          isAuthenticated
            ? <Navigate to="/home" replace />
            : <Navigate to="/login" replace />
        }
      />

      {/* LOGIN */}
      <Route
        path="/login"
        element={
          isAuthenticated
            ? <Navigate to="/home" replace />
            : <Login />
        }
      />

      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* HOME (STUDENT / PROFESSOR / GUEST) */}
      <Route
        path="/home/*"
        element={
          isAuthenticated
            ? <Home />
            : <Navigate to="/login" replace />
        }
      />

      {/* NOTICE BOARD (READ-ONLY FOR GUEST) */}
      <Route
        path="/noticeboard/*"
        element={
          role === "STUDENT" || role === "PROFESSOR" || role === "GUEST"
            ? <NoticeBoard />
            : <Navigate to="/login" replace />
        }
      />


      {/* POST NOTICE (ONLY PROFESSOR) */}
      <Route
        path="/post-notice"
        element={
          isAuthenticated && role === "PROFESSOR"
            ? <PostNotice />
            : <Navigate to="/home" replace />
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;