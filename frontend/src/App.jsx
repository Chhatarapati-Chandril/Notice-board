import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { restoreSession } from "./redux/authapi";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import NoticeBoard from "./pages/NoticeBoard";
import PostNotice from "./pages/PostNotice";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  // ✅ Restore session ONCE on app load
  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  // ⏳ Block routing until auth is resolved
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

      {/* AUTH */}
      <Route
        path="/login"
        element={
          isAuthenticated
            ? <Navigate to="/home" replace />
            : <Login />
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* APP */}
      <Route
        path="/home/*"
        element={
          isAuthenticated
            ? <Home />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/noticeboard/*"
        element={
          isAuthenticated
            ? <NoticeBoard />
            : <Navigate to="/login" replace />
        }
      />

      <Route
        path="/post-notice"
        element={
          isAuthenticated
            ? <PostNotice />
            : <Navigate to="/login" replace />
        }
      />

      {/* FALLBACK */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
