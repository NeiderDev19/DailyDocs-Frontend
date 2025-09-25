import React from "react";
import DashBoard from "./DashBoard";
import { Outlet } from "react-router-dom";
import "../styles/DashBoard.css"
import ListaUsuarios from "./App/ListUsers";

function Layout(){
    return (
        <div>
            <DashBoard/>
            <div className="main-content">
                <Outlet>
                </Outlet>
            </div>
        </div>
    )
}

export default Layout;