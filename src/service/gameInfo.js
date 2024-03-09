import api from "./api";

export const addGameInfo = async (gameInfo) => {
    const { data } = await api.post(`/gameInfo/addGameInfo`, gameInfo);
    return data;
  };

  export const getGameInfo = async (gameInfoId) => {
    const { data } = await api.get(`/gameInfo/${gameInfoId}`);
    return data;
  };