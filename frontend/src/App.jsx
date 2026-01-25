// App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./pages/login";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import NoticeBoard from "./pages/NoticeBoard";
import PostNotice from "./pages/PostNotice";

function App() {
  const isLoggedIn = useSelector((state) => state.auth.isAuthenticated);

  return (
    <Routes>
      <Route
        path="/"
        element={isLoggedIn ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />}
      />
      <Route
        path="/login"
        element={isLoggedIn ? <Navigate to="/home" replace /> : <Login />}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Home route */}
      <Route
        path="/home/*"
        element={isLoggedIn ? <Home /> : <Navigate to="/login" replace />}
      />

      {/* Notice Board */}
      <Route
        path="/noticeboard"
        element={isLoggedIn ? <NoticeBoard /> : <Navigate to="/login" replace />}
      />

      {/* Post notice (professor only) */}
      <Route
        path="/post-notice"
        element={isLoggedIn ? <PostNotice /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}

export default App;
