import api from "./api";

export const getStatus = async () => {
    const { data } = await api.get("/status/health");
    return data;
}