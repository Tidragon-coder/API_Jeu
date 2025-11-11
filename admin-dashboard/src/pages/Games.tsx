import React, { useEffect, useState } from "react";
import axios from "axios";
import callApi from "../api/api";
import Error from "../components/molecules/401";

import type { ErrorState } from "../types/error";
import type { Game } from "../types/game";

export default function Games() {
  const [games, setGames] = useState<Game[]>([]);
  const [genres, setGenres] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState>({ code: 0, message: "" });

  const [showForm, setShowForm] = useState(false);
  const [newGame, setNewGame] = useState({
    title: "",
    description: "",
    release_year: "",
    genre: "",
  });

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
      setShowForm(false);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError({
          code: err.response?.status || 500,
          message: err.response?.data?.message || "Erreur lors de l’ajout du jeu.",
        });
      } else {
        setError({ code: 500, message: "Erreur inconnue." });
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
            )) }

          </div>
          <button
            type="submit"
            className="mt-4 bg-[#4F7C77] text-white px-4 py-2 rounded hover:opacity-80"
          >
            Save
          </button>
        </form>
      )}

      <table className="w-full border-collapse bg-white shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3 text-left text-sm font-medium text-gray-900">ID</th>
            <th className="p-3 text-left text-sm font-medium text-gray-900">Title</th>
            <th className="p-3 text-left text-sm font-medium text-gray-900">Genre</th>
            <th className="p-3 text-left text-sm font-medium text-gray-900">Release Year</th>
          </tr>
        </thead>
        <tbody>
          {games.map((g) => (
            <tr key={g._id} className="border-t hover:bg-gray-50">
              <td className="p-3 text-sm text-gray-700">{g._id}</td>
              <td className="p-3 text-sm font-medium text-gray-900">{g.title}</td>
              <td className="p-3 text-sm text-gray-700">
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

