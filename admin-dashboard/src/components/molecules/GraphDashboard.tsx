import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import axios from "axios";
import { LineChart } from '@mui/x-charts/LineChart';
import callApi from "../../api/api";
import Error from "../../components/molecules/Error";
import type { ErrorState } from '../../types/error';

const margin = { right: 24 };
const Time = [
    '5 sem',
    '4 sem',
    '3 sem',
    '2 sem',
    '1 sem',
    'Today',
];


export default function SimpleLineChart() {
    const [error, setError] = useState<ErrorState>({ code: 0, message: "" });
    const [userData, setUserDate] = useState<number[]>([]);
    
    const fetchData = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return setError({ code: 401, message: "Token manquant." });
    
            const res = await callApi("/stats/user-stats/QperDay", token, "GET");
            console.log(res.results)
            setUserDate(res.results)
        } catch (err) {
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
    
    useEffect(() => {
        fetchData()
    }, []);

    if (error.code)
        return (
            <div className="flex justify-center mt-8">
                <Error number={error.code} message={error.message} />
            </div>
        );
    return (
        <Box sx={{ width: '100%', height: 300 }}>
            <LineChart
                series={[
                    { data: userData, label: 'Nombre Utilisateurs' }
                ]}
                xAxis={[{ scaleType: 'point', data: Time }]}
                yAxis={[{ width: 50 }]}
                margin={margin}
            />
        </Box>
    );
}