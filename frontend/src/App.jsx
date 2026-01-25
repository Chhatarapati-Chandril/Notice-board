import { Routes, Route, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import { restoreSession } from "./redux/authapi.js";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import NoticeBoard from "./pages/NoticeBoard";
import PostNotice from "./pages/PostNotice";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
  if (!isAuthenticated) {
    dispatch(restoreSession());
  }
}, [dispatch, isAuthenticated]);



  if (loading) return <div>Checking session...</div>;

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated
            ? <Navigate to="/home" replace />
            : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/home" replace /> : <Login />
        }
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route
        path="/home/*"
        element={
          isAuthenticated ? <Home /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/noticeboard"
        element={
          isAuthenticated ? <NoticeBoard /> : <Navigate to="/login" replace />
        }
      />
      <Route
        path="/post-notice"
        element={
          isAuthenticated ? <PostNotice /> : <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}

export default App;
