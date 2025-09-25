import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { verificarCodigo } from "../services/authService";

function VerificarCodigo() {

    const [codigo, setCodigo] = useState(Array(6).fill(""));
    const navigate = useNavigate("");

    const handleChange = (e, index) => {
        const value = e.target.value;

        if (/^[0-9]?$/.test(value)) { // solo permite un dígito
            const newCodigo = [...codigo];
            newCodigo[index] = value;
            setCodigo(newCodigo);

            // pasar al siguiente input automáticamente
            if (value !== "" && index < 5) {
                document.getElementById(`input-${index + 1}`).focus();
            }
        }
       
    }
    //manejar retroceso para ir atras
     const handleKeyDown = (e, index) => {
            if (e.key === "Backspace" && codigo[index] === "" && index > 0) {
                document.getElementById(`input-${index - 1}`).focus();
            }
    };

    const verificar = () => {
    const codigoFinal = codigo.join("");
    const correo = localStorage.getItem("correo");
    try{
        verificarCodigo(correo,codigoFinal); 
        toast.success("codigo verificado exitosamente");   
        setTimeout(()=>navigate("/cambiarContraseña"),2000);
    }catch(err){
         toast.error(err.response?.data || err.message);
    }
    
    };

    return (
        <div className="container">
            <div style={{marginTop:""}} className="sections">
                <section className="img-dailydocs">
                    <img style={{ width: "200px" }} src="/img/image.png" alt="" />
                </section>
                <section className="verificar-codigo">
                    <h2 style={{marginBottom:"15px" , color:"#333"}}>Recuperar Contraseña</h2>
                    <p style={{margin:"30px",color:"#333"}} className="ingresa">Ingresa el codigo de 6 digitos</p>

                    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                        {codigo.map((valor, index) => (
                            <input
                                key={index}
                                id={`input-${index}`}
                                type="text"
                                maxLength="1"
                                value={valor}
                                onChange={(e) => handleChange(e, index)}
                                onKeyDown={(e) => handleKeyDown(e, index)}
                                style={{
                                    width: "42px",
                                    height: "52px",
                                    textAlign: "center",
                                    fontSize: "20px",
                                    border: "1px solid #ccc",
                                    borderRadius: "8px"
                                }}
                            />
                        ))}
                    </div>
                    <div className="buttons">
                    <button
                        onClick={verificar}
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
                        Verificar
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

export default VerificarCodigo;