import React, { useState } from "react";
import "../styles/Register.css"
import { register } from "../services/authService";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";


function Register(){

    const [correo,setCorreo] = useState("");
    const[contraseña,setContraseña] = useState("");
    const [nombres,setNombres] = useState("");
    const[apellidos,setApellidos] = useState("");
      const navigate = useNavigate();


    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            await register({correo,contraseña,nombres,apellidos});
            toast.success("Registro exitoso 🎉");
            setTimeout(() => navigate("/"), 2000); // redirige después de 2 seg
        }catch(err){
                  toast.error("Error al registrar usuario", err.response?.data || err.message);
        }

    }

    return (
        <div className="container-register">
            <div className="register">
                <img src="/img/image.png" alt="logo" />
                <h2>Registro</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text"
                    placeholder="Nombres"
                    value={nombres}
                    onChange={(e) => setNombres(e.target.value)} />
                    <input type="text"
                    placeholder="Apellidos"
                    value={apellidos}
                    onChange={(e)=> setApellidos(e.target.value)} />
                    <input type="text"
                    placeholder="Correo"
                    value={correo}
                    onChange={(e)=> setCorreo(e.target.value)}
                     />
                     <input type="password"
                     placeholder="Contraseña"
                     value={contraseña}
                     onChange={(e)=> setContraseña(e.target.value)} />
                     <div className="buttons">
                     <button className="registrarse" type="submit">
                        Registrarme
                     </button>
                     <button className="regresar" type="button" onClick={()=>navigate("/")}>
                        Regresar
                     </button>
                     </div>
                </form>
            </div>
        </div>
    );
}


export default Register;