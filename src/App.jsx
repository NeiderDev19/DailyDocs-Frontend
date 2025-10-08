import Login from './components/Login.jsx';
import { Routes, Route, useLocation } from "react-router-dom";
import './App.css'
import Register from './components/Register.jsx';
import EnviarCodigo from './components/EnviarCodigo.jsx';
import VerificarCodigo from './components/VerificarCodigo.jsx';
import CambiarContraseña from './components/CambiarContraseña.jsx';
import DashBoard from './components/DashBoard.jsx';
import Layout from './components/Layout.jsx';
import OAuth2RedirectHandler from './components/OAuth2RedirectHandler.jsx';
import ListaUsuarios from './components/App/ListUsers.jsx'; 
import "primeflex/primeflex.css";
import DocumentosList from './components/App/DocumentosList.jsx';
import TableDocumentos from './components/App/TableDocumentos.jsx';
import UserInbox from './components/Chat/UserInbox.jsx';
import { useEffect } from 'react';

// ⚡ Fix para SockJS en navegador
window.global ||= window;

function App() {

  const location = useLocation();


  useEffect(() => {
    if (
      location.pathname === "/" ||
      location.pathname === "/Register" ||
      location.pathname === "/enviarCodigo" ||
      location.pathname === "/verificarCodigo" ||
      location.pathname === "/cambiarContraseña"
    ) {
      document.body.classList.add("auth-body");
    } else {
      document.body.classList.remove("auth-body");
    }
  }, [location]);


  return (
   <Routes>
      <Route path='/' element={<Login/>} />
      <Route path='/register' element={<Register/>} />
      <Route path='/enviarCodigo' element={<EnviarCodigo/>} />
      <Route path='/verificarCodigo' element={<VerificarCodigo/>} />
      <Route path='/cambiarContraseña' element={<CambiarContraseña/>} />
      <Route path="/oauth2/success" element={<OAuth2RedirectHandler />} />
      {/* Rutas app */}
      <Route path="/app" element={<Layout/>}>
        <Route path="usuarios" element={<ListaUsuarios/>} />
        <Route path="documentos" element={<DocumentosList/>} />
        <Route path="documentosid" element={<TableDocumentos/>}/>
        <Route path="mensajes" element={<UserInbox/>}/>
      </Route>
   </Routes>
  )
}

export default App
