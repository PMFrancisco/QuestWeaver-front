import api from "./api";

export const getGames = async () => { 
    const { data } = await api.get(`/games`);
    return data;
  };

  export const createGame = async (userId, gameData) => {
    const { data } = await api.post(`/games/createGame/${userId}`, gameData);
    return data;
  };