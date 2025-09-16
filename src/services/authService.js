import axios from "axios";

const API_URL = "http://localhost:8080/api";

export const login = async(correo,password) => {
    const response = await axios.post(`${API_URL}/authenticate/login`,{correo,password});
    return response.data;
}

export async function register(userData) {
  const res = await axios.post(`${API_URL}/usuarios/register`, userData);
  return res.data;
}