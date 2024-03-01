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

export const editUserProfile = async (userId, profileData) => {
  const { data } = await api.put(`/profile/edit/${userId}`, profileData);
  return data;
};

export const editProfileImage = async (userId, profileData) => {
  const { data } = await api.post(`/profile/updateProfilePicture/${userId}`, profileData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
};