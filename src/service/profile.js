import api from "./api";

export const createProfile = async (profileInfo) => {
  try {
    await api.post("/profile", profileInfo);
  } catch (error) {
    console.log(error);
  }
};

export const getUserProfile = async (userId) => { 
  const { data } = await api.get(`/profile/${userId}`);
  return data;
};

export const editUserProfile = async (userId) => {
  const { data } = await api.put(`/edit/${userId}`);
  return data;
};