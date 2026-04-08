import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation
} from "react-router-dom";

import { useState, useEffect } from "react";

import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import Search from "./pages/Search";
import Favorites from "./pages/Favourites";
import AddReview from "./pages/AddReview";
import Recommendations from "./pages/Recommendations";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Footer from "./components/Footer";

/* ===================== APP WRAPPER ===================== */

function AppWrapper() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  return (
    <BrowserRouter>
      <AppContent token={token} setToken={setToken} />
    </BrowserRouter>
  );
}

/* ===================== APP CONTENT ===================== */

function AppContent({ token, setToken }) {
  const location = useLocation();

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#141414",
        color: "#fff",
        paddingTop: token? "70px" : "0px" // for fixed navbar
      }}
    >
      {/* Navbar */}
      {token && <Navbar setToken={setToken} />}

      <Routes>
        {/* Default */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public Routes */}
        <Route
          path="/login"
          element={
            !token ? (
              <Login setToken={setToken} />
            ) : (
              <Navigate to="/home" />
            )
          }
        />

        <Route
          path="/register"
          element={!token ? <Register /> : <Navigate to="/home" />}
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <PrivateRoute token={token}>
              <Home />
            </PrivateRoute>
          }
        />

        <Route
          path="/movie/:id"
          element={
            <PrivateRoute token={token}>
              <MovieDetails />
            </PrivateRoute>
          }
        />

        <Route
          path="/search"
          element={
            <PrivateRoute token={token}>
              <Search />
            </PrivateRoute>
          }
        />

        <Route
          path="/favorites"
          element={
            <PrivateRoute token={token}>
              <Favorites />
            </PrivateRoute>
          }
        />

        <Route
          path="/movie/:id/review"
          element={
            <PrivateRoute token={token}>
              <AddReview />
            </PrivateRoute>
          }
        />

        <Route
          path="/recommendations"
          element={
            <PrivateRoute token={token}>
              <Recommendations />
            </PrivateRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <PrivateRoute token={token}>
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>

      {/* Footer only on home */}
      {token && location.pathname === "/home" && <Footer />}
    </div>
  );
}

export default AppWrapper;