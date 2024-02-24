import api from "./api";

export const createUser = async (profileInfo) => {
  try {
    await api.post("/profile", profileInfo);
  } catch (error) {
    console.log(error);
  }
};

