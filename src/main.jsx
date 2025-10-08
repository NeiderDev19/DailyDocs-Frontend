import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import React from "react";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Estilos base de primereact
import 'primereact/resources/themes/lara-light-blue/theme.css'; // 👈 puedes cambiar de tema
import 'primereact/resources/primereact.min.css';

// Estilos de íconos
import 'primeicons/primeicons.css';
// ⚡ Fix para SockJS en navegador
window.global ||= window;

createRoot(document.getElementById('root')).render(
   <React.StrictMode>
    <BrowserRouter>
      <App />
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  </React.StrictMode>
)
