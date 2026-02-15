import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";

import callApi from "../api/api";

const Login = () => {
  const { notify } = useNotification();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {

      const res = await callApi('/users/login', '', 'POST', { email, password });
      const { token } = res;

      // ✅ Sauvegarde du token
      localStorage.setItem("token", token);
      localStorage.setItem("id", res.user._id);

      notify("connexion reussie ", "success");

      navigate("/dashboard");

    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        notify(err.response?.data?.message || "Erreur de connexion ❌", "error");
      } else {
        notify("Une erreur inattendue est survenue ❌", "error");
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-80 text-white"
      >
        <h2 className="text-2xl mb-6 text-center font-bold">Connexion</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
          required
        />

        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-6 rounded bg-gray-700 border border-gray-600 focus:outline-none focus:border-blue-500"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 p-2 rounded font-semibold transition-colors"
        >
          Se connecter
        </button>
        <button className="w-full bg-red-600 hover:bg-blue-700 p-2 rounded font-semibold transition-colors mt-4" onClick={() => navigate("/register")}>Creer un compte</button>
      </form>
    </div>
  );
};

export default Login;

