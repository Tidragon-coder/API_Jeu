import React, { useEffect, useState } from "react";
import axios from "axios";

interface Game {
  _id: string;
  title: string;
  description?: string;
  release_year?: number;
  genre: {
    _id: string;
    name: string; // si ton modèle Genre a un champ name
  };
}

export default function Games() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchGames = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Aucun token trouvé. Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }

      const res = await axios.get("http://localhost:3000/game/games/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setGames(res.data.games);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Erreur lors du chargement des jeux.");
      } else {
        setError("Erreur inconnue.");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchGames();
}, []);


  if (loading)
    return <p className="text-center mt-8 text-gray-600">Chargement des jeux...</p>;

  if (error)
    return <p className="text-center mt-8 text-red-500">{error}</p>;

  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Games</h2>
        <button className="bg-[#4F7C77] text-white px-4 py-2 rounded-lg hover:opacity-80">
          + Add Game
        </button>
      </div>

      <table className="w-full border-collapse bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left text-sm font-medium text-gray-900">Title</th>
            <th className="p-3 text-left text-sm font-medium text-gray-900">Genre</th>
            <th className="p-3 text-left text-sm font-medium text-gray-900">Release Year</th>
          </tr>
        </thead>
        <tbody>
          {games.map((g) => (
            <tr key={g._id} className="border-t hover:bg-gray-50">
              <td className="p-3 text-sm font-medium text-gray-900">{g.title}</td>
              <td className="p-3 text-sm font-medium text-gray-900">
                {typeof g.genre === "object" ? g.genre.name : g.genre}
              </td>
              <td className="p-3 text-sm font-medium text-gray-900">{g.release_year || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
