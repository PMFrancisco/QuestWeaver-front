import api from "./api";


export const addCategory = async (categoryInfo) => {
    const { data } = await api.post(`/categories/addCategory`, categoryInfo);
    return data;
  };

export const getCategories = async (gameId) => {
    const { data } = await api.get(`/categories/${gameId}`);
    return data;
  };