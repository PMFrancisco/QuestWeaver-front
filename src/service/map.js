import api from "./api";

export const getMap = async (gameId) => {
  const { data } = await api.get(`/map/${gameId}`);
  return data;
};

export const createMap = async (gameId, mapData) => {
  const { data } = await api.post(`/map/uploadMap/${gameId}`, mapData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};

export const saveMapStatus = async ({gameId, mapData}) => {
  const { data } = await api.post(`/map/saveMapStatus/${gameId}`, {
    mapData: mapData,
  });
  return data;
};

