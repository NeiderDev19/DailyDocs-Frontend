import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { cambiarContrasena } from "../services/authService";


function CambiarContraseña(){

    const [password,setPassword] = useState("");
    const [confirmar,setConfirmar] = useState("");
    const navigate = useNavigate();

    const handleSubmit = () => {
    if (password.length < 6) {
      toast.warn("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (password !== confirmar) {
      toast.warn("Las contraseñas no coinciden");
      return;
    }

    // Aquí conectas con tu backend
    const correo = localStorage.getItem("correo");
    cambiarContrasena(correo,password);
    localStorage.removeItem("correo");
    toast.success("Contraseña cambiada con éxito ✅");
    navigate("/"); // Redirigir al login
    };

    return (
        <div className="container">
            <div style={{marginTop:"10px"}} className="sections">
                <section className="img-dailydocs">
                    <img style={{ width: "200px" }} src="/img/image.png" alt="" />
                </section>
                <section className="verificar-codigo">
                    <h2 style={{marginBottom:"15px",color:"#333"}}>Recuperar Contraseña</h2>
                    <p style={{margin:"30px",color:"#333"}} className="ingresa">Ingresa tu nueva contraseña</p>

                    <input style={{margin:"20px"}} className="input" 
                    type="password" 
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    placeholder="contraseña" />

                    <input style={{margin:"20px"}} className="input" type="password"
                    value={confirmar} 
                    onChange={(e)=>setConfirmar(e.target.value)}
                    placeholder=" Repita la contraseña" />
                    
                    <div className="buttons">
                    <button
                        onClick={handleSubmit}
                        style={{
                            marginTop: "20px",
                            padding: "10px 20px",
                            fontSize: "16px",
                            borderRadius: "8px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            cursor: "pointer"
                        }}
                    >
                        Cambiar
                    </button>
                    <button  type="button"
                    onClick={()=>navigate("/")}
                        style={{
                            marginTop: "20px",
                            padding: "10px 20px",
                            fontSize: "16px",
                            borderRadius: "8px",
                            backgroundColor: "#ff2200ff",
                            color: "white",
                            border: "none",
                            cursor: "pointer"
                        }}
                    >Cancelar
                    </button>
                    </div>

                </section>
            </div>
        </div>
    );
}

export default CambiarContraseña;