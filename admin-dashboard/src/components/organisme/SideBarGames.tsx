"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useNotification } from "../../context/NotificationContext";

import callApi from "../../api/api";

import type { GameID, Game } from "../../types/game";
import type { Genre } from "../../types/genre";
import type { ErrorState } from "../../types/error";
import Error from "../molecules/Error";

interface SideBarUserProps {
    game: GameID;
    genreFetch: Genre[];
    onClose?: () => void;
}

export default function SideBarUser({ game, onClose, genreFetch }: SideBarUserProps) {
    const { notify } = useNotification();
    const [error, setError] = useState<ErrorState>({ code: 0, message: "" });
    const [gameData, setGameData] = useState<any>(null);
    const [putGame, setPutGame] = useState<Game>({ _id: "", title: "", description: "", release_year: undefined, editor: "", genre: null, platform: "", mode: "", perspective: "", slug: "" });
    const [genres, setGenres] = useState<Genre[]>([]);

    useEffect(() => {
        const fetchGame = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError({ code: 401, message: "Token manquant." });
                    return;
                }

                const res = await callApi(`/game/${game}`, token, "GET");
                setGameData(res.game);
                setPutGame({ _id: res.game._id, title: res.game.title, description: res.game.description, release_year: res.game.release_year, editor: res.game.editor, genre: res.game.genre, platform: res.game.platform, mode: res.game.mode, perspective: res.game.perspective, slug: res.game.slug });

                // chargement des genres 
                setGenres(genreFetch);
            } catch (err) {
                (err);
                setError({ code: 500, message: "Erreur lors du chargement utilisateur." });
            }
        };

        fetchGame();
    }, [game]);

    const handleputGame = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!window.confirm(`Etes-vous sur de vouloir modifier le jeu ${gameData.title} ?`)) return;
        try {
            const token = localStorage.getItem("token");
            if (!token) return setError({ code: 401, message: "Token manquant." });

            const preloading: any = { title: putGame.title, description: putGame.description, release_year: putGame.release_year, editor: putGame.editor, genre: putGame.genre, platform: putGame.platform, mode: putGame.mode, perspective: putGame.perspective, slug: putGame.slug };

            // if (putGame.password) preloading.password = putGame.password;

            await callApi(`/game/${game}`, token, "PUT", preloading);

            setPutGame({ _id: "", title: "", description: "", release_year: undefined, editor: "", genre: null, platform: "", mode: "", perspective: "", slug: "" });
            notify("Modification effectuée.", "success");
            onClose?.();
            window.location.reload();

        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                notify(err.response?.data?.message || "Erreur inattendue.", "error");
            } else {
                notify("Une erreur inattendue est survenue ❌", "error");
            }
        }
    };
    if (error.code)
        return (
            <div className="flex justify-center mt-8">
                <Error number={error.code} message={error.message} />
            </div>
        );

    return (
        <div className="fixed inset-0 z-50 flex">

            <div
                onClick={onClose}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            />

            <div className="ml-auto h-full w-80 bg-white shadow-xl border-l p-6 relative animate-slide-left overflow-y-auto">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                >
                    ✕
                </button>

                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Éditer le Jeu "{putGame.title}"
                </h2>

                {!gameData ? (
                    <p>Chargement...</p>
                ) : (
                    <>

                        <div className="space-y-6">
                            <form
                                onSubmit={handleputGame}
                                className="flex flex-col gap-6 bg-white/40 p-4 rounded-lg"
                            >
                                <div className="grid gap-4">
                                    {/* Titre */}
                                    <div className="flex flex-col">
                                        <label className="text-sm text-gray-700 font-medium mb-1">
                                            Titre
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Titre"
                                            defaultValue={gameData.name}
                                            value={putGame.title}
                                            onChange={(e) => setPutGame({ ...putGame, title: e.target.value })}
                                            required
                                            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F7C77]"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div className="flex flex-col">
                                        <label className="text-sm text-gray-700 font-medium mb-1">
                                            Description
                                        </label>
                                        <textarea
                                            placeholder="Description"
                                            defaultValue={gameData.nickname}
                                            value={putGame.description}
                                            onChange={(e) => setPutGame({ ...putGame, description: e.target.value })}
                                            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F7C77]"
                                            rows={3}
                                        />
                                    </div>

                                    {/* Année de sortie */}
                                    <div className="flex flex-col">
                                        <label className="text-sm text-gray-700 font-medium mb-1">
                                            Année de sortie
                                        </label>
                                        <input
                                            type="number"
                                            placeholder="2005"
                                            min={1900}
                                            max={new Date().getFullYear()}
                                            defaultValue={gameData.release_year}
                                            value={putGame.release_year ?? ""}
                                            onChange={(e) => setPutGame({ ...putGame, release_year: Number(e.target.value) })}
                                            required
                                            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F7C77]"
                                        />
                                    </div>

                                    {/* Editor */}
                                    <div className="flex flex-col">
                                        <label className="text-sm text-gray-700 font-medium mb-1">
                                            Editor
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="ConcernedApe"
                                            defaultValue={gameData.editor}
                                            value={putGame.editor}
                                            onChange={(e) => setPutGame({ ...putGame, editor: e.target.value })}
                                            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F7C77]"
                                        />
                                    </div>

                                    {/* Genre */}
                                    <div className="flex flex-col">
                                        <label className="text-sm text-gray-700 font-medium mb-1">
                                            Genre
                                        </label>

                                        <select
                                            value={putGame.genre?._id || ""}
                                            onChange={(e) => {
                                                const selectedGenre =
                                                    genres.find(g => g._id === e.target.value) || null;

                                                setPutGame({ ...putGame, genre: selectedGenre });
                                            }}
                                            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F7C77]"
                                        >
                                            <option value="">Sélectionner un genre</option>

                                            {genres.map((genre) => (
                                                <option key={genre._id} value={genre._id}>
                                                    {genre.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>


                                    {/* Platform */}
                                    <div className="flex flex-col">
                                        <label className="text-sm text-gray-700 font-medium mb-1">
                                            Platform
                                        </label>
                                        <select
                                            value={putGame.platform}
                                            defaultValue={gameData.platform}
                                            onChange={(e) =>
                                                setPutGame({ ...putGame, platform: e.target.value })
                                            }
                                            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F7C77]"
                                        >
                                            <option value="">Sélectionner une plateforme</option>
                                            <option value="PC">PC</option>
                                            <option value="Console Salon">Console Salon</option>
                                            <option value="Console Portable">Console Portable</option>
                                        </select>
                                    </div>

                                    {/* Mode de Jeu */}
                                    <div className="flex flex-col">
                                        <label className="text-sm text-gray-700 font-medium mb-1">
                                            Mode de jeu
                                        </label>
                                        <select
                                            value={putGame.mode}
                                            defaultValue={gameData.mode}
                                            onChange={(e) =>
                                                setPutGame({ ...putGame, mode: e.target.value })
                                            }
                                            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F7C77]"
                                        >
                                            <option value="">Sélectionner un mode</option>
                                            <option value="Singleplayer">Singleplayer</option>
                                            <option value="Multiplayer">Multiplayer</option>
                                        </select>
                                    </div>

                                    {/* perspective */}
                                    <div className="flex flex-col">
                                        <label className="text-sm text-gray-700 font-medium mb-1">
                                            Perspective
                                        </label>
                                        <select
                                            value={putGame.perspective}
                                            defaultValue={gameData.perspective}
                                            onChange={(e) =>
                                                setPutGame({ ...putGame, perspective: e.target.value })
                                            }
                                            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F7C77]"
                                        >
                                            <option value="">Sélectionner une perspective</option>
                                            <option value="Top-Down">Top-Down</option>
                                            <option value="First-Person">First-Person</option>
                                            <option value="Third-Person">Third-Person</option>
                                        </select>
                                    </div>

                                    {/* Slug */}
                                    <div className="flex flex-col">
                                        <label className="text-sm text-gray-700 font-medium mb-1">
                                            Slug
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="/nom-du-jeu"
                                            defaultValue={gameData.slug}
                                            value={putGame.slug}
                                            onChange={(e) => setPutGame({ ...putGame, slug: e.target.value })}
                                            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F7C77]"
                                        />
                                    </div>

                                </div>

                                <button
                                    type="submit"
                                    className="bg-[#4F7C77] text-white font-medium w-full py-2 rounded-lg hover:opacity-90 transition"
                                >
                                    Enregistrer
                                </button>
                            </form>
                        </div>
                    </>
                )}
            </div>
        </div >
    );
}