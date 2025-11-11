import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: apiUrl,
    headers: {
        'Content-Type': 'application/json',
    },
})

export default async function apiRequest(endpoint: string, token: string, method: 'GET' | 'POST' | 'PUT' | 'DELETE', data?: any) {
    try {
        const response = await api.request({
            url: endpoint,
            method,
            data,
            headers: {
                ...(token && { Authorization: `Bearer ${token}` }),
                // ...headers,
            },
        })
        return response.data
    } catch (error: any) {
        if(error.response){
            console.error(`Erreur API [${error.response.status}]: `, error.response.data)
            throw error
        } else {
            console.error(`Erreur reseau ou serveur:`, error.message);
            throw error
        }
    }
}