import { useEffect, useState } from "react";
import axios from "axios";
import callApi from "../api/api";
import Error from "../components/molecules/Error";

import type { ErrorState } from "../types/error";
import type { Game } from "../types/game";


export default function GameListPage() {

    const [algo, setAlgo] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<ErrorState>({ code: 0, message: "" });
    const [games, setGames] = useState<Game[]>([]);
    const [gameId, setGameId] = useState<string>("");


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
            console.log(res);
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

    const fetchUsers = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!gameId) {
            setError({ code: 400, message: "Veuillez sélectionner un jeu." });
            return;
        }

        try {
            setLoading(true);

            const token = localStorage.getItem("token");
            if (!token) {
                setError({ code: 401, message: "Aucun token trouvé. Veuillez vous reconnecter." });
                return;
            }

            const data = await callApi(`algo/gameAlgo/${gameId}`, token,"GET");

            setAlgo(data.GameGenre || data);
        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError({
                    code: err.response?.status || 500,
                    message: err.response?.data?.message || "Erreur lors du chargement.",
                });
            } else {
                setError({ code: 500, message: "Erreur inconnue." });
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

    if (error.code)
        return (
            <div className="flex justify-center mt-8">
                <Error number={error.code} message={error.message} />
            </div>
        );

return (
    <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
                Algorithme de recommandation
            </h2>
        </div>

        <form
            onSubmit={fetchUsers}
            className="bg-white shadow-md rounded-lg p-4 mb-6 border border-gray-200 flex items-end gap-4"
        >
            <div className="flex flex-col w-full max-w-sm">
                <label className="text-sm font-medium text-gray-600 mb-1">
                    Choisir un jeu
                </label>
                <select
                    name="game"
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                    className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#4F7C77]"
                >
                    <option value="">-- Please choose an option --</option>
                    {games.map((g) => (
                        <option key={g._id} value={g._id}>
                            {g.title}
                        </option>
                    ))}
                </select>
            </div>

            <button
                type="submit"
                className="bg-[#4F7C77] text-white px-6 py-2 rounded-lg hover:opacity-80 transition"
            >
                Lancer l’algo
            </button>
        </form>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Résultats
            </h3>

            {algo.length === 0 ? (
                <p className="text-gray-500 text-sm">
                    Aucun résultat pour le moment.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {algo.map((a) => (
                        <div
                            key={a._id}
                            className="border rounded-lg p-4 hover:shadow-md transition"
                        >
                            <h4 className="font-medium text-gray-800">
                                {a.title}
                            </h4>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
);

}