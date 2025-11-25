import api from "./api";

export const signin = async (data) => {
  const response = api.post("/auth/login", data);

  return response;
};

export const createUser = async (data) => {
  const response = api.post("/auth/signup", data);

  return response;
};
