import api from "./api";

export const getAllGames = async () => {
  const { data } = await api.get(`/games`);
  return data;
};

export const createGame = async (userId, gameData) => {
  const { data } = await api.post(`/games/createGame/${userId}`, gameData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const getOneGame = async (gameId, userId) => {
  const { data } = await api.get(`/games/${gameId}/${userId}`);
  return data;
};

export const joinGame = async (userId, gameId) => {
  const { data } = await api.post(`/games/joinGame/${userId}/${gameId}`);
  return data;
};

export const acceptPlayer = async (userId, gameId) => {
  const { data } = await api.post(`/games/acceptPlayer/${userId}/${gameId}`);
  return data;
};
