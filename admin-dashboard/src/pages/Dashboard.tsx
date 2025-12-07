import { useEffect, useState } from "react";
import axios from "axios";
import Card from "../components/molecules/Card";
import callApi from "../api/api";
import Error from "../components/molecules/Error";
import type { ErrorState } from "../types/error";

import Graph from "../components/molecules/GraphDashboard";

export default function Dashboard() {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [totalGames, setTotalGames] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [totalGenres, setTotalGenres] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ErrorState>({ code: 0, message: "" });


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError({ code: 401, message: "Aucun token trouvé. Veuillez vous reconnecter." });
          setLoading(false);
          return;
        }

        const [usersRes, gamesRes, reviewsRes, genresRes] = await Promise.all([
          callApi('/users/', token, 'GET'),
          callApi('/game/all', token, 'GET'),
          callApi('/review/all', token, 'GET'),
          callApi('/genre/all', token, 'GET'),
        ]);

        setTotalUsers(usersRes.users?.length || 0);
        setTotalGames(gamesRes.games?.length || 0);
        setTotalReviews(reviewsRes.review?.length || 0);
        setTotalGenres(genresRes.genres?.length || 0);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError({
            code: err.response?.status || 500,
            message: err.response?.data?.message || "Erreur lors du chargement du tableau de bord.",
          });
        } else {
          setError({ code: 500, message: "Erreur inconnue." });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);
  if (loading) return <p className="text-center mt-8 text-gray-600">Chargement...</p>;
  if (error.code) return <div className="flex justify-center mt-8"> <Error number={error.code} message={error.message} /> </div>;

  return (
    <>
      <div className="p-6 grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <Card title="Total Users" value={totalUsers.toString()} />
        <Card title="Games" value={totalGames.toString()} />
        <Card title="Reviews" value={totalReviews.toString()} />
        <Card title="Genres" value={totalGenres.toString()} />
      </div>
      <div className="p-6">
        <Graph />
      </div>

    </>
  );
}