import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import callApi from "../api/api";
import Error from "../components/molecules/401";

import type { ErrorState } from "../types/error";
import type { Review } from "../types/review";

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [games, setGames] = useState<{ _id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState>({ code: 0, message: "" });

  const [showForm, setShowForm] = useState(false);
  const [newReview, setNewReview] = useState({
    user: "",
    game: "",
    rating: 0,
    comment: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError({ code: 401, message: "Aucun token trouvé. Veuillez vous reconnecter." });
          setLoading(false);
          return;
        }

        const res = await callApi("/review/all", token, "GET");
        setReviews(Array.isArray(res.review) ? res.review : []);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError({
            code: err.response?.status || 500,
            message: err.response?.data?.message || "Erreur lors du chargement des reviews.",
          });
        } else {
          setError({ code: 500, message: "Erreur inconnue." });
        }
      } finally {
        setLoading(false);
      }
    };

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
      }
    };

    fetchGames();
    fetchReviews();
  }, []);

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) return setError({ code: 401, message: "Token manquant." });

      const res = await callApi("/review/new", token, "POST", {
        user: newReview.user,
        game: newReview.game,
        rating: newReview.rating,
        comment: newReview.comment,
      });

      setReviews((prev) => [...prev, res.data.review]);
      setNewReview({ user: "", game: "", rating: 0, comment: "" });
      setShowForm(false);
      navigate("/reviews");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError({
          code: err.response?.status || 500,
          message: err.response?.data?.message || "Erreur lors de la création de l’avis.",
        });
      } else {
        setError({ code: 500, message: "Erreur inconnue." });
      }
    }
  };

  if (loading)
    return <p className="text-center mt-8 text-gray-600">Chargement des reviews...</p>;

  if (error.code)
    return (
      <div className="flex justify-center mt-8">
        <Error number={error.code} message={error.message} />
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Reviews</h2>

      <button
        className="bg-[#4F7C77] text-white px-4 py-2 rounded-lg hover:opacity-80 mb-4"
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Fermer le formulaire" : " Ajouter un avis"}
      </button>

      {showForm && (
        <form
          onSubmit={handleAddReview}
          className="bg-white shadow-md rounded-lg p-4 mb-6 border border-gray-200"
        >
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="User (ID)"
              value={newReview.user}
              onChange={(e) => setNewReview({ ...newReview, user: e.target.value })}
              required
              className="border p-2 rounded"
            />
            <select
              value={newReview.game}
              onChange={(e) => setNewReview({ ...newReview, game: e.target.value })}
              className="border p-2 rounded"
            >
              <option value="" selected>
                Sélectionnez un jeu
              </option>
              {games.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.title || g._id}
                </option>
              ))}
            </select>

            <input
              type="number"
              min={1}
              max={5}
              placeholder="Rating"
              value={newReview.rating}
              onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
              required
              className="border p-2 rounded"
            />
            <input
              type="text"
              placeholder="Votre commentaire"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              required
              className="border p-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="mt-4 bg-[#4F7C77] text-white px-4 py-2 rounded hover:opacity-80"
          >
            Enregistrer
          </button>
        </form>
      )}

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
                Rating
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comment
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviews.map((r) => (
              <tr key={r._id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 text-sm text-gray-700">{r._id}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {r.user?.nickname || r.user?.email || r.user?._id}
                </td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">
                  {r.game?.title || r.game?._id}
                </td>
                <td
                  className={`px-6 py-4 text-sm font-medium ${
                    r.rating >= 4
                      ? "text-green-600"
                      : r.rating <= 2
                      ? "text-red-600"
                      : "text-yellow-600"
                  }`}
                >
                  {r.rating <= 2 ? r.rating + " ❌" : r.rating == 3 ? r.rating + " ⚠️" : r.rating + " ✅"}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{r.comment || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
