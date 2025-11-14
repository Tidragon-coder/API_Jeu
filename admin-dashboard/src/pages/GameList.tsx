import React, { useEffect, useState } from "react";
import axios from "axios";
import callApi from "../api/api";
import Error from "../components/molecules/Error";

import type { ErrorState } from "../types/error";
import type { GameList } from "../types/gameList";
import type { Game } from "../types/game";

export default function GameListPage() {
  const [gameList, setGameList] = useState<GameList[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState>({ code: 0, message: "" });

  const [showForm, setShowForm] = useState(false);
  const [newGameList, setNewGameList] = useState({
    user: "",
    game: "",
    status: "Pending",
  });

  // 🔹 Récupérer la liste des GameList
  const fetchGameList = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError({ code: 401, message: "Aucun token trouvé. Veuillez vous reconnecter." });
        setLoading(false);
        return;
      }

      const res = await callApi("/gamelist/all", token, "GET");
      setGameList(Array.isArray(res.gamelist) ? res.gamelist : []);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError({
          code: err.response?.status || 500,
          message: err.response?.data?.message || "Erreur lors du chargement des listes de jeux.",
        });
      } else {
        setError({ code: 500, message: "Erreur inconnue." });
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Récupérer tous les jeux disponibles
  const fetchGames = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return setError({ code: 401, message: "Token manquant." });

      const res = await callApi("/game/all", token, "GET");
      setGames(Array.isArray(res.games) ? res.games : []);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError({
          code: err.response?.status || 500,
          message: err.response?.data?.message || "Erreur lors du chargement des jeux.",
        });
      } else {
        setError({ code: 500, message: "Erreur inconnue." });
      }
    }
  };

  // 🔹 Ajouter une GameList
  const handleAddGameList = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return setError({ code: 401, message: "Token manquant." });

      const res = await callApi("/gamelist/new", token, "POST", {
        user: newGameList.user,
        game: newGameList.game,
        status: newGameList.status,
      });

      setGameList((prev) => [...prev, res.gamelist || res.data]);
      setNewGameList({ user: "", game: "", status: "Pending" });
      setShowForm(false);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError({
          code: err.response?.status || 500,
          message: err.response?.data?.message || "Erreur lors de la création de la GameList.",
        });
      } else {
        setError({ code: 500, message: "Erreur inconnue." });
      }
    }
  };

  useEffect(() => {
    fetchGameList();
    fetchGames();
  }, []);

  if (loading)
    return <p className="text-center mt-8 text-gray-600">Chargement...</p>;

  if (error.code)
    return (
      <div className="flex justify-center mt-8">
        <Error number={error.code} message={error.message} />
      </div>
    );

  return (
    <div className="px-6 py-4">
      <h2 className="text-2xl font-semibold mb-4">Game Lists</h2>

      {/* Bouton pour afficher / masquer le formulaire */}
      <button
        className="bg-[#4F7C77] text-white px-4 py-2 rounded-lg hover:opacity-80 mb-4"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Fermer le formulaire" : "➕ Ajouter une GameList"}
      </button>

      {/* Formulaire d’ajout */}
      {showForm && (
        <form
          onSubmit={handleAddGameList}
          className="bg-white shadow-md rounded-lg p-4 mb-6 border border-gray-200"
        >
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="User ID"
              value={newGameList.user}
              onChange={(e) =>
                setNewGameList({ ...newGameList, user: e.target.value })
              }
              required
              className="border p-2 rounded"
            />
            <select
              value={newGameList.game}
              onChange={(e) =>
                setNewGameList({ ...newGameList, game: e.target.value })
              }
              required
              className="border p-2 rounded"
            >
              <option value="">Sélectionnez un jeu</option>
              {games.length === 0 ? (
                <option key="" value="none" disabled>
                  Pas de jeu créé
                </option>
              ) : (
                games.map((g) => (
                  <option key={g._id} value={g._id}>
                    {g.title}
                  </option>
                ))
              )}
            </select>
            <select
              value={newGameList.status}
              onChange={(e) =>
                setNewGameList({ ...newGameList, status: e.target.value })
              }
              className="border p-2 rounded"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="finished">Finished</option>
            </select>
          </div>

          <button
            type="submit"
            className="mt-4 bg-[#4F7C77] text-white px-4 py-2 rounded hover:opacity-80"
          >
            Enregistrer
          </button>
        </form>
      )}

      {/* Tableau */}
      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Game
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action Admin
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {gameList.map((g) => (
              <tr
                key={g._id}
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 text-sm text-gray-700">{g._id}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{g.user}</td>
                <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                  {g.game?.title || "Inconnu"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">{g.status}</td>
                <td className="px-6 py-4 text-sm text-gray-500 flex space-x-4">
                  <a href="#" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#b89007" stroke-width="1.5" d="m14.36 4.079l.927-.927a3.932 3.932 0 0 1 5.561 5.561l-.927.927m-5.56-5.561s.115 1.97 1.853 3.707C17.952 9.524 19.92 9.64 19.92 9.64m-5.56-5.561l-8.522 8.52c-.577.578-.866.867-1.114 1.185a6.6 6.6 0 0 0-.749 1.211c-.173.364-.302.752-.56 1.526l-1.094 3.281m17.6-10.162L11.4 18.16c-.577.577-.866.866-1.184 1.114a6.6 6.6 0 0 1-1.211.749c-.364.173-.751.302-1.526.56l-3.281 1.094m0 0l-.802.268a1.06 1.06 0 0 1-1.342-1.342l.268-.802m1.876 1.876l-1.876-1.876" /></svg>
                  </a>
                  <a href="#" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="#d80808" d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5t.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5t-.288.713T19 6v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zm-7 11q.425 0 .713-.288T11 16V9q0-.425-.288-.712T10 8t-.712.288T9 9v7q0 .425.288.713T10 17m4 0q.425 0 .713-.288T15 16V9q0-.425-.288-.712T14 8t-.712.288T13 9v7q0 .425.288.713T14 17M7 6v13z" /></svg>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

