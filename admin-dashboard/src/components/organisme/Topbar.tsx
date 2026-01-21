import { useEffect, useState } from "react";
import axios from "axios";
import callApi from "../../api/api";
import type { ErrorState } from "../../types/error";


export default function Topbar() {
  const [error, setError] = useState<ErrorState>({ code: 0, message: "" });
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState<string | null>(null);
  const [role, setRole] = useState<string | null>(null);


  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError({ code: 401, message: "Aucun token trouvé. Veuillez vous reconnecter." });
        return;
      }

      const res = await callApi("/users/info/me", token, "GET");
      setName(res.users.nickname);
      setRole(res.users.role);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError({
          code: err.response?.status || 500,
          message: err.response?.data?.message || "Erreur lors du chargement des jeux.",
        });
      } else {
        setError({ code: 500, message: "Erreur inconnue." });
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    if (!window.confirm("Etes-vous sur de vouloir vous deconnecter ?")) return;
    localStorage.removeItem("id");
    localStorage.removeItem("token");
    window.location.href = "/"; // redirige vers la page de login
  };

  if (loading)
    return <p className="text-center mt-8 text-gray-600">Chargement des jeux...</p>;

  if (error.code)
    return (
      <div className="flex justify-center mt-8">
        Error, name {error.code}: {error.message}
      </div>
    );
  return (
  <header className="flex justify-between items-center px-6 py-3 bg-white shadow-sm">
    <h2 className="text-xl font-semibold text-[#0D0A4B]">Admin Dashboard</h2>

    <div className="flex items-center gap-4">
      {name ? (
        <span  className={`text-sm max-w-xs truncate ${role === "admin" ? "text-red-500 font-bold" : "text-gray-500"}`} >
          Bienvenue, {name} ({role})
        </span>
      ) : (
        <span className="text-sm text-gray-500">Aucun nom</span>
      )}

      <button
        onClick={handleLogout}
        className="bg-[#4F7C77] text-white px-4 py-2 rounded-lg hover:opacity-80"
      >
        Logout
      </button>
    </div>
  </header>
);
}
