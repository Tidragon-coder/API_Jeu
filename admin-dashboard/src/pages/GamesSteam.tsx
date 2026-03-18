import { useEffect, useState } from "react";
import axios from "axios";
import callApi from "../api/api";
import Error from "../components/molecules/Error";
import { useNotification } from "../context/NotificationContext";
import type { ErrorState } from "../types/error";
import type { SteamGame } from "../types/steamGame";

export default function GamesSteam() {
  const { notify } = useNotification();
  const [games, setGames] = useState<SteamGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState>({ code: 0, message: "" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300);
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const fetchSteamGames = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setError({ code: 401, message: "Aucun token trouvé. Veuillez vous reconnecter." });
          setLoading(false);
          return;
        }
        const res = await callApi(
          `/steam?page=${page}&limit=${pageSize}&q=${encodeURIComponent(debouncedQuery)}`,
          token,
          "GET"
        );
        setGames(Array.isArray(res.games) ? res.games : []);
        if (res.totalPages) setTotalPages(res.totalPages);
        if (res.pageSize) setPageSize(res.pageSize);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setError({
            code: err.response?.status || 500,
            message: err.response?.data?.message || "Erreur lors du chargement des jeux Steam.",
          });
        } else {
          setError({ code: 500, message: "Erreur inconnue." });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchSteamGames();
  }, [page, pageSize, debouncedQuery]);

  if (loading) return <p className="text-center mt-8 text-gray-600">Chargement des jeux Steam...</p>;

  if (error.code)
    return (
      <div className="flex justify-center mt-8">
        <Error number={error.code} message={error.message} />
      </div>
    );

  return (
    <div className="px-6 py-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">Games Steam</h2>
        <button
          className="bg-[#4F7C77] text-white px-4 py-2 rounded-lg hover:opacity-80"
          onClick={() => notify("Lecture seule pour l’instant. Import via backend.", "info")}
        >
          Import en cours
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setPage(1); // reset page when query changes
            setQuery(e.target.value);
          }}
          placeholder="Rechercher par titre..."
          className="w-full max-w-md border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4F7C77]"
        />
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-200">
        <table className="min-w-max divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">AppID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Titre</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Genres</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Editeurs</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sortie</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meta</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {games.map((g) => (
              <tr key={g._id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-4 py-3 text-sm text-gray-700">{g.steamAppId}</td>
                <td className="px-4 py-3 text-sm font-semibold text-gray-900 flex items-center gap-3">
                  {g.headerImage ? (
                    <img src={g.headerImage} alt={g.title} className="h-10 w-auto rounded" />
                  ) : (
                    <div className="h-10 w-16 bg-gray-200 rounded" />
                  )}
                  <div className="flex flex-col">
                    <span>{g.title}</span>
                    <span className="text-xs text-gray-500">
                      {g.shortDescription
                        ? `${g.shortDescription.slice(0, 50)}${g.shortDescription.length >50 ? "…" : ""}`
                        : "—"}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {g.genres && g.genres.length ? g.genres.join(", ") : "—"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {g.price?.final !== undefined
                    ? `${(g.price.final / 100).toFixed(2)} ${g.price.currency || ""}${
                        g.price.discountPercent ? ` (-${g.price.discountPercent}%)` : ""
                      }`
                  : "GRATUIT"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {g.publishers?.length ? g.publishers.join(", ") : "—"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">
                  {g.releaseDate ? new Date(g.releaseDate).toLocaleDateString() : "—"}
                </td>
                <td className="px-4 py-3 text-sm text-gray-700">{g.requiredAge ?? "—"}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{g.metacriticScore ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">
          Page {page} / {totalPages}
        </div>
        <div className="flex gap-2">
          <button
            className="px-3 py-1 rounded border border-gray-300 text-gray-700 disabled:opacity-50"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page <= 1}
          >
            Précédent
          </button>
          <button
            className="px-3 py-1 rounded border border-gray-300 text-gray-700 disabled:opacity-50"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page >= totalPages}
          >
            Suivant
          </button>
        </div>
      </div>
    </div>
  );
}
