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

export async function enviarCodigo(correo) {
  const res = await axios.post(`${API_URL}/authenticate/enviarCodigo?correo=${correo}`)
  return res.data;
}

export async function verificarCodigo(correo,codigo){
  const res = await axios.post(`${API_URL}/authenticate/verificarCodigo?correo=${correo}&codigo=${codigo}`);
  return res.data;
}

export async function cambiarContrasena(correo,nuevaContrasena){
  const res = await axios.post(`${API_URL}/authenticate/cambiarContrasena?correo=${correo}&nuevaContrasena=${nuevaContrasena}`);
  return res.data;
}

export const loginGoogle = async () => {
  const response = await axios.get("http://localhost:8080/api/auth/success-google"); 
  const user = response.data;

  // Guardar en localStorage
  localStorage.setItem("token", user.token);
  localStorage.setItem("username", user.username);
  localStorage.setItem("role", user.role);

  return user;
};