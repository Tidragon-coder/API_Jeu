import React, { useEffect, useState } from "react";
import axios from "axios";
import callApi from "../api/api";
import Error from "../components/molecules/Error";
import { useNotification } from "../context/NotificationContext";

import type { ErrorState } from "../types/error";
import type { Game } from "../types/game";
import type { Genre } from "../types/genre";

export default function Games() {
  const { notify } = useNotification();
  const [games, setGames] = useState<Game[]>([]);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState>({ code: 0, message: "" });

  const [showForm, setShowForm] = useState(false);
  const [newGame, setNewGame] = useState({ title: "", description: "", release_year: "", genre: "" });

  const fetchGames = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError({ code: 401, message: "Aucun token trouvé. Veuillez vous reconnecter." });
        setLoading(false);
        return;
      }

      const res = await callApi("/game/all", token, "GET");
      setGames(Array.isArray(res.games) ? res.games : []);
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

  const fetchGenres = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError({ code: 401, message: "Aucun token trouvé. Veuillez vous reconnecter." });
        setLoading(false);
        return;
      }

      const res = await callApi("/genre/all", token, "GET");
      setGenres(Array.isArray(res.genres) ? res.genres : []);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError({
          code: err.response?.status || 500,
          message: err.response?.data?.message || "Erreur lors du chargement des genres.",
        });
      } else {
        setError({ code: 500, message: "Erreur inconnue." });
      }
    }
  };

  useEffect(() => {
    fetchGames();
    fetchGenres();
  }, []);

  const handleAddGame = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return setError({ code: 401, message: "Token manquant." });

      const res = await callApi("/game/new", token, "POST", {
        title: newGame.title,
        description: newGame.description,
        release_year: Number(newGame.release_year),
        genre: newGame.genre,
      });

      setGames((prev) => [...prev, res.game]);
      setNewGame({ title: "", description: "", release_year: "", genre: "" });
      notify("Jeu ajouté.", "success");
      setShowForm(false);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        notify(err.response?.data?.message || "Erreur lors de l'ajout du jeu.", "error");
      } else {
        notify("Une erreur inattendue est survenue", "error");
      }
    }
  };

    const handleAdminGame = async (id: string, action: "delete" | "update", name: string) => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return setError({ code: 401, message: "Token manquant." });
  
        if (action === "delete"){
          if (!window.confirm(`Etes-vous sur de vouloir supprimer le genre ${name} ?`)) return;
        }
  
        if (action === "update"){
          if (!window.confirm(`Etes-vous sur de vouloir modif le genre ${name} ?`)) return;
        }
  
        if (action === "delete"){
          console.log(id);
          await callApi(`/game/${id}`, token, "DELETE")
          notify("game supprimé.", "success");
        };

        if (action === "update") await callApi(`/genre/${id}`, token, "PUT");
  
  
        setGenres((prev) => prev.filter((genre) => genre._id !== id));
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          notify(err.response?.data?.message || "Erreur lors de la suppression du genre.", "error");
        } else {
          notify("Une erreur inattendue est survenue", "error");
        }
      }
    };

  if (loading)
    return <p className="text-center mt-8 text-gray-600">Chargement des jeux...</p>;

  if (error.code)
    return (
      <div className="flex justify-center mt-8">
        <Error number={error.code} message={error.message} />
      </div>
    );

    if (games.length === 0)
    return (
      <div className="flex justify-center mt-8">
        <p className="text-center mt-8 text-gray-600">Aucun jeu trouvé.</p>
      </div>
    );

  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Games</h2>
        <button
          className="bg-[#4F7C77] text-white px-4 py-2 rounded-lg hover:opacity-80"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "+ Add Game"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleAddGame}
          className="bg-white shadow-md rounded-lg p-4 mb-6 border border-gray-200"
        >
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Title"
              value={newGame.title}
              onChange={(e) => setNewGame({ ...newGame, title: e.target.value })}
              required
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Description"
              value={newGame.description}
              onChange={(e) => setNewGame({ ...newGame, description: e.target.value })}
              className="border p-2 rounded"
            />
            <input
              type="number"
              placeholder="Release year"
              value={newGame.release_year}
              onChange={(e) => setNewGame({ ...newGame, release_year: e.target.value })}
              className="border p-2 rounded"
            />
            {genres.map(g => (
              <div key={g._id} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={g._id}
                  name="genre"
                  value={g._id}
                  checked={newGame.genre === g._id}
                  onChange={(e) => setNewGame({ ...newGame, genre: e.target.value })}
                  className="border"
                />
                <label htmlFor={g._id}>{g.name}</label>
              </div>
            ))}

          </div>
          <button
            type="submit"
            className="mt-4 bg-[#4F7C77] text-white px-4 py-2 rounded hover:opacity-80"
          >
            Save
          </button>
        </form>
      )}

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-max divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Genre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Release Year
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Editeur
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Platforme de Jeu
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mode
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Perspective
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Slug
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions Admin
              </th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {games.map((g) => (
              <tr key={g._id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 text-sm text-gray-700">{g._id}</td>

                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {g.title}
                </td>

                <td className="px-6 py-4 text-sm text-gray-700">
                  {g.genre && typeof g.genre === "object"
                    ? g.genre.name
                    : typeof g.genre === "string"
                    ? g.genre
                    : "—"}
                </td>

                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {g.release_year || "—"}
                </td>

                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {g.editor || "—"}
                </td>

                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {g.platform || "—"}
                </td>

                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {g.mode || "—"}
                </td>

                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {g.perspective || "—"}
                </td>

                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {g.slug || "—"}
                </td>


                <td className="px-6 py-4 text-sm text-gray-500 flex space-x-4">
                  <a href="#" >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#b89007" stroke-width="1.5" d="m14.36 4.079l.927-.927a3.932 3.932 0 0 1 5.561 5.561l-.927.927m-5.56-5.561s.115 1.97 1.853 3.707C17.952 9.524 19.92 9.64 19.92 9.64m-5.56-5.561l-8.522 8.52c-.577.578-.866.867-1.114 1.185a6.6 6.6 0 0 0-.749 1.211c-.173.364-.302.752-.56 1.526l-1.094 3.281m17.6-10.162L11.4 18.16c-.577.577-.866.866-1.184 1.114a6.6 6.6 0 0 1-1.211.749c-.364.173-.751.302-1.526.56l-3.281 1.094m0 0l-.802.268a1.06 1.06 0 0 1-1.342-1.342l.268-.802m1.876 1.876l-1.876-1.876" /></svg>
                  </a>
                  <a href='#' onClick={() => handleAdminGame(g._id, "delete", g.title)} >
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

