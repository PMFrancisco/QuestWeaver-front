import api from "./api";


export const addCategory = async (categoryInfo) => {
    const { data } = await api.post(`/categories/addCategory`, categoryInfo);
    return data;
  };