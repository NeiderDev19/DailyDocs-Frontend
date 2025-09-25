import axios from "axios";

export const getUsuarios = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get("http://localhost:8080/api/usuarios", {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    return response.data; // 👈 aquí ya tienes el JSON
  } catch (error) {
    console.error("Error obteniendo usuarios", error);
    throw error;
  }
};
