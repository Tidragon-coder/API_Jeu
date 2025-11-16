import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { NotificationProvider } from "./context/NotificationContext";

import Sidebar from "./components/organisme/Sidebar";
import Topbar from "./components/organisme/Topbar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Games from "./pages/Games";
import Login from "./pages/login";
import Review from "./pages/Review";
import Genres from "./pages/Genre";
import Register from "./pages/register";
import GameList from "./pages/GameList";
import NotificationList from "./components/molecules/NotificationList";

function Protected() {
  const token = localStorage.getItem("token");

  // on renvoie vers /login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex">
      <Sidebar />
      <main className="ml-60 w-full bg-gray-50 min-h-screen">
        <Topbar />
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <NotificationProvider>
        <NotificationList />
        <Routes>
          {/* Routes publiques */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Routes protégées */}
          <Route element={<Protected />}>
            {/* / -> redirige automatiquement vers /dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/games" element={<Games />} />
            <Route path="/reviews" element={<Review />} />
            <Route path="/genres" element={<Genres />} />
            <Route path="/gamelist" element={<GameList />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </NotificationProvider>
    </Router>
  );
}