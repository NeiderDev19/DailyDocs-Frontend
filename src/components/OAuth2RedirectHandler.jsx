import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OAuth2RedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const username = params.get("username");
    const role = params.get("role");
    const id = params.get("id");

    if (token) {
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);
      localStorage.setItem("role", role);
      localStorage.setItem("id",id);
      console.log(localStorage.getItem("token"))
      window.location.href = "/app/documentos"; // en vez de navigate
    } else {
      navigate("/");
    }
  }, [navigate]);

  return <p>Procesando login con Google...</p>;
}

export default OAuth2RedirectHandler;
