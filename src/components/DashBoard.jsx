import React, { useState } from "react";
import "../styles/DashBoard.css";
import { Link } from "react-router-dom";

function DashBoard(){

    const [isOpen,setIsOpen] = useState(false);
    const openMenu = () =>{
        setIsOpen(true);
    }

    const toggleMenu = () =>{
        setIsOpen(!isOpen);
    };

    const cerrarSesion = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("role");
    }

    return(
        <div className={`menu-dashboard ${isOpen ? "open" : ""}`}>
            <div className="top-menu">
                <div className="logo">
                    <img style={{width:"50px"}} src="/img/image.png" alt="" />
                    <span>DailyDocs</span>
                </div>
                <div className="toggle" onClick={toggleMenu}>
                    <i className="fa-solid fa-bars"></i>
                </div>
            </div>
            <div className="input-search">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input type="text" className="input-dashboard" placeholder="Buscar" />
            </div>
            <div className="menu">
                { localStorage.getItem("role") === 'ADMINISTRADOR' && (
                <Link  to="usuarios" onClick={openMenu} className="enlace">
                    <i className="fa-solid fa-users"/>
                    <span>Users</span>
                </Link>
                )
                }
                <Link to="documentosid" onClick={openMenu} className="enlace">
                    <i className="fa-solid fa-file"></i>
                    <span>Mis Documentos</span>
                </Link>
                <Link to="documentos" onClick={openMenu} className="enlace">
                    <i className="fa-solid fa-file"></i>
                    <span>Bitacoras</span>
                </Link>
                <Link to="mensajes" onClick={openMenu} className="enlace">
                    <i className="fa-solid fa-comments"/>
                    <span>Mensajes</span>
                </Link>
                <Link onClick={openMenu} className="enlace">
                    <i className="fa-solid fa-gear"></i>
                    <span>Configuracion</span>
                </Link>
            </div>
            <Link onClick={cerrarSesion} to="/" className="enlace-cerrar-sesion">
                    <i className="fa-solid fa-right-from-bracket"></i>
                    <span>Cerrar sesion</span>
            </Link>
        </div>
    );
}

export default DashBoard;