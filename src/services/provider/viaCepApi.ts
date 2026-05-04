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
        (config as any)._shouldDecrement = true;
        useLoadingStore.getState().increment();
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

viaCepApi.interceptors.response.use(
    (response) => {
        if ((response.config as any)._shouldDecrement) {
            useLoadingStore.getState().decrement();
        }
        return response;
    },
    (error) => {
        if (error.config?._shouldDecrement) {
            useLoadingStore.getState().decrement();
        }
        return Promise.reject(error);
    }
);

export default viaCepApi;
