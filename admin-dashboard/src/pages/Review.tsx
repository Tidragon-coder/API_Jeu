import React, { useEffect, useState } from "react";
import axios from "axios";

interface Review {
  _id: string;
  user: string;
  game: string;
  rating: number;
  comment?: string;
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Aucun token trouvé. Veuillez vous reconnecter.");
          setLoading(false);
          return;
        }

        const res = await axios.get("http://localhost:3000/game/reviews", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // On prend exactement res.data.reviews si le back renvoie { reviews, message }
        console.log(res.data);
        setReviews(res.data.review || res.data);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data?.message || "Erreur lors du chargement des reviews.");
        } else {
          setError("Erreur inconnue.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading)
    return <p className="text-center mt-8 text-gray-600">Chargement des reviews...</p>;

  if (error)
    return <p className="text-center mt-8 text-red-500">{error}</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Reviews</h2>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Game</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comment</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviews.map((r) => (
              <tr key={r._id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{r.user}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{r.game}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{r.rating}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{r.comment || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
