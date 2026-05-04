import axios from "axios";
import { useLoadingStore } from "../../store/useLoadingStore";

const viaCepApi = axios.create({
    baseURL: "https://viacep.com.br/ws/",
    headers: {
        "Content-Type": "application/json",
    },
});

viaCepApi.interceptors.request.use(
    (config) => {
        useLoadingStore.getState().increment();
        return config;
    },
    (error) => {
        useLoadingStore.getState().decrement();
        return Promise.reject(error);
    }
);

viaCepApi.interceptors.response.use(
    (response) => {
        useLoadingStore.getState().decrement();
        return response;
    },
    (error) => {
        useLoadingStore.getState().decrement();
        return Promise.reject(error);
    }
);

export default viaCepApi;
