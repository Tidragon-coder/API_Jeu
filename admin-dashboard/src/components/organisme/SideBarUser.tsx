"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import callApi from "../../api/api";

import type { UserId } from "../../types/user";
import type { ErrorState } from "../../types/error";
import Error from "../molecules/Error";

interface SideBarUserProps {
    user: UserId;
    onClose?: () => void;
}

export default function SideBarUser({ user, onClose }: SideBarUserProps) {
    const [error, setError] = useState<ErrorState>({ code: 0, message: "" });
    const [userData, setUserData] = useState<any>(null);
    const [putUser, setPutUser] = useState({
        name: "",
        nickname: "",
        email: "",
        role: "",
        password: "",
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError({ code: 401, message: "Token manquant." });
                    return;
                }

                const res = await callApi(`/users/${user}`, token, "GET");
                setUserData(res.users);
                setPutUser({name: res.users.name, nickname: res.users.nickname, email: res.users.email, role: res.users.role, password: ""});
                console.log("UserData", res.users);
                console.log("PutUser", putUser);
            } catch (err) {
                console.log(err);
                setError({ code: 500, message: "Erreur lors du chargement utilisateur." });
            }
        };

        fetchUser();
    }, [user]);

    const handlePutUser = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!window.confirm(`Etes-vous sur de vouloir modifier le profil de ${userData.name} ${userData.nickname} ?`)) return;
        try {
            const token = localStorage.getItem("token");
            if (!token) return setError({ code: 401, message: "Token manquant." });

            const preloading: any ={name: putUser.name, nickname: putUser.nickname, email: putUser.email, role: putUser.role};

            if (putUser.password) preloading.password = putUser.password;

            await callApi(`/users/${user}`, token, "PUT", preloading);

            setPutUser({ name: "", nickname: "", email: "", role: "", password: "" });
            onClose?.();
            window.location.reload();

        } catch (err: unknown) {
            if (axios.isAxiosError(err)) {
                setError({
                    code: err.response?.status || 500,
                    message: err.response?.data?.message || "Erreur lors de la création de l’utilisateur.",
                });
            } else {
                setError({ code: 500, message: "Erreur inconnue." });
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

            <div className="ml-auto h-full w-80 bg-white shadow-xl border-l p-6 relative animate-slide-left">

                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                >
                    ✕
                </button>

                <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    Éditer l'utilisateur
                </h2>

                {!userData ? (
                    <p>Chargement...</p>
                ) : (
                    <>
                        <p className="text-sm text-gray-600 mb-6">
                            ID sélectionné :
                            <span className="block font-mono text-gray-800 text-md mt-1">
                                {user}
                            </span>
                        </p>

                        <div className="space-y-6">
                            <form
                                onSubmit={handlePutUser}
                                className="flex flex-col gap-6 bg-white/40 p-4 rounded-lg"
                            >
                                <div className="grid gap-4">
                                    {/* Nom */}
                                    <div className="flex flex-col">
                                        <label className="text-sm text-gray-700 font-medium mb-1">
                                            Nom
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Nom"
                                            defaultValue={userData.name}
                                            value={putUser.name}
                                            onChange={(e) => setPutUser({ ...putUser, name: e.target.value })}
                                            required
                                            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F7C77]"
                                        />
                                    </div>

                                    {/* Nickname */}
                                    <div className="flex flex-col">
                                        <label className="text-sm text-gray-700 font-medium mb-1">
                                            Nickname
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="Nickname"
                                            defaultValue={userData.nickname}
                                            value={putUser.nickname}
                                            onChange={(e) => setPutUser({ ...putUser, nickname: e.target.value })}
                                            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F7C77]"
                                        />
                                    </div>

                                    {/* Email */}
                                    <div className="flex flex-col">
                                        <label className="text-sm text-gray-700 font-medium mb-1">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            placeholder="Email"
                                            defaultValue={userData.email}
                                            value={putUser.email}
                                            onChange={(e) => setPutUser({ ...putUser, email: e.target.value })}
                                            required
                                            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F7C77]"
                                        />
                                    </div>
                                    {/* Role */}
                                    <div className="flex flex-col">
                                        <label className="text-sm text-gray-700 font-medium mb-1 text-red-700">
                                            Role ⚠️
                                        </label>
                                        <select
                                            defaultValue={userData.role}
                                            value={putUser.role}
                                            onChange={(e) => setPutUser({ ...putUser, role: e.target.value })}
                                            required
                                            className="border border-gray-300 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4F7C77]">
                                            <option value="admin" className="bg-red-700">Admin</option>
                                            <option value="user">User</option>
                                        </select>
                                    </div>

                                    {/* Mot de passe */}
                                    <div className="flex flex-col">
                                        <label className="text-sm text-gray-700 font-medium mb-1">
                                            Mot de passe
                                        </label>
                                        <input
                                            type="password"
                                            placeholder="Mot de passe"
                                            onChange={(e) => setPutUser({ ...putUser, password: e.target.value })}
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
        </div>
    );
}
