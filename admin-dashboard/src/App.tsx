import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Games from "./pages/Games";
import Login from "./pages/login";
import Review from "./pages/Review";
import Genres from "./pages/Genre";
import Register from "./pages/register";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Partie protégée */}
        <Route
          path="/*"
          element={
            localStorage.getItem("token") ? (
              <div className="flex">
                <Sidebar />
                <main className="ml-60 w-full bg-gray-50 min-h-screen">
                  <Topbar />
                  <Routes>
                    <Route path="/Dashboard" element={<Dashboard />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/games" element={<Games />} />
                    <Route path="/reviews" element={<Review />} />
                    <Route path="/genres" element={<Genres />} />
                  </Routes>
                </main>
              </div>
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}
