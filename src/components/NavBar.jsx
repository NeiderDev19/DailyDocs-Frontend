import React from "react";
import './NavBar.css';

function NavBar(){
    return (
        <>
            <div className="navbar-header">
             <nav className="navbar">
                <div className="logo">
                    <img src="../public/img/image.png" alt="logo" />
                    <h2 className="title">DailyDocs</h2>
                </div>
                <div className="links">
                    <a href="/">Inicio</a>
                    <a href="/about">Nosotros</a>
                    <a href="/contact">Contacto</a>
                </div>
            </nav>
            </div>
        </>
    )
}


export default NavBar;