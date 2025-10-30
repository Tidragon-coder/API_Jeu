import React, { useEffect, useState } from "react";
import axios from "axios";

interface GameList {
  _id: string;
  user: string;
  game: {
    _id: string;
    title: string;
    genre?: { name: string };
  };
  status: string;
}

export default function Games() {
  const [gameList, setGameList] = useState<GameList[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Aucun token trouvé. Veuillez vous reconnecter.");
        setLoading(false);
        return;
      }

      const res = await axios.get("http://localhost:3000/api/gamelist/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Réponse API :", res.data);
      // Certains back renvoient { gamelist: [...] }, d’autres renvoient directement [...]
      const list = Array.isArray(res.data) ? res.data : res.data.gamelist;
      setGameList(list || []);
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

  useEffect(() => {
    fetchGames();
  }, []);

  if (loading)
    return <p className="text-center mt-8 text-gray-600">Chargement des jeux...</p>;

  if (error)
    return <p className="text-center mt-8 text-red-500">{error}</p>;

  return (
    <div className="px-6 py-4">
      <h2 className="text-2xl font-semibold mb-4">Games</h2>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Game</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {gameList.map((g) => (
              <tr key={g._id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 text-sm text-gray-700">{g._id}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{g.user}</td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {g.game?.title || "Inconnu"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{g.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
