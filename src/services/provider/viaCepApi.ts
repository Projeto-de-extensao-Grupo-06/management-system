import axios from "axios";

const viaCepApi = axios.create({
    baseURL: "https://viacep.com.br/ws/",
    headers: {
        "Content-Type": "application/json",
    },
});

export default viaCepApi;
