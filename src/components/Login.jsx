import React, { useState } from "react";
import '../styles/Login.css';
import { login } from "../services/authService";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";


function Login() {

    const [correo, setCorreo] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const user = await login(correo, password);

            //guardar en el localstorage
            localStorage.setItem("token", user.token);
            localStorage.setItem("username", user.username);
            localStorage.setItem("id",user.id);
            localStorage.setItem("role", user.role);
            toast.success("usuario logueado");
            navigate("/app/documentos");
        } catch (err) {
            toast.error("Credenciales incorrectas",err.response?.data || err.message);
        }
    }

    return (
        <div className="container">
            <div className="login">
                <div>
                <img className="logo" src="/img/image.png" alt="logo" />
                </div>
                <h2 className="">Iniciar Sesión</h2>
                <div className="header">
                <p>Ingresa con :</p>
                <button className="btn-gmail" type="button"
                 onClick={() => window.location.href = "http://localhost:8080/oauth2/authorization/google"}
                        style={{ cursor: "pointer" }}>
                Iniciar sesión
                <img className="img-gmail" src="\img\Gmail_icon_(2020).svg.png" alt=""/>
                </button>
                </div>
                <form onSubmit={handleSubmit}>
                    <p>Usa tu cuenta:</p>
                    <input type="email"
                        value={correo}
                        placeholder="email"
                        onChange={(e) => setCorreo(e.target.value)}></input>
                    <input type="password"
                        placeholder="contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}></input>
                    <button className="registrarse" type="submit">Entrar</button>
                    <div className="links">
                        <p>¿No tienes una cuenta? <Link style={{textDecoration:"none"}} to="/Register">Registrate</Link></p>
                        <p><Link style={{textDecoration:"none"}} to="/enviarCodigo">¿Olvidaste tu contraseña?</Link></p>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;