// services/api.js
import axios from "axios";

const api = axios.create({
    baseURL: "https://tccdrakes.azurewebsites.net/",
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "User-Agent": "MobileApp",
    },
});

export default api;
