import Login from './components/Login.jsx';
import { Routes, Route } from "react-router-dom";
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

function App() {


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
      </Route>
   </Routes>
  )
}

export default App
