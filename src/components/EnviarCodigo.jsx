import React,{useState} from "react";
import { enviarCodigo } from "../services/authService";
import "../styles/EnviarCodigo.css"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function EnviarCodigo(){

    const [correo,setCorreo] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
            e.preventDefault();
            try {
                await enviarCodigo(correo);
                toast.success("Hemos enviado un codigo a tu correo");
                localStorage.setItem("correo",correo);
                setTimeout(() => navigate("/verificarCodigo"), 2000); // redirige después de 2 seg
            } catch (err) {
                toast.error(err.response?.data || err.message);
            }
        }

    return (
        <div className="container-enviarCodigo" style={{display:"flex",
            flexDirection:"column",
            textAlign:"center",
            justifyContent:"center",
            alignItems:"center",
            }}>
            <div className="sections">
            <section className="img-dailydocs">
                <img style={{width:"200px"}} src="/img/image.png" alt="" />
            </section>
            <section className="recuperar">
                <h2>Recuperar Contraseña</h2>
                <p className="ingresa">Ingresa tu correo electronico</p>
                <form style={{display:"flex",
                flexDirection:"column"}}
                 onSubmit={handleSubmit}>
                    <input type="email"
                    placeholder="correo"
                    value={correo}
                    onChange={(e)=>setCorreo(e.target.value)} />
                    <div className="buttons">
                    <button className="enviar" type="submit">
                        Enviar
                    </button>
                    <button className="cancelar" type="button"
                    onClick={()=>navigate("/")}>
                        Cancelar
                    </button>
                    </div>
                </form>
            </section>
            </div>
        </div>
    );
} 

export default EnviarCodigo;