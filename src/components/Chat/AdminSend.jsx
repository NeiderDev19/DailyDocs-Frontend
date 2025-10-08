// src/components/AdminSend.jsx
import React, { useState } from "react";
import usePrivateChat from "../../services/UsePrivateChat";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from 'primereact/button';



export default function AdminSend({toUserId}) {
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]); // 👈 guardamos mensajes recibidos

  const idAdmin = localStorage.getItem("id");

  // Hook: admin se suscribe a su canal privado
  const { sendMessage, connected } = usePrivateChat(idAdmin, (msg) => {
    setMessages((prev) => [...prev, msg]); // guarda mensajes entrantes
  });

  const handleSend = () => {
    if (!toUserId || !text) return;
    const message = {
      fromUserId: idAdmin,
      toUserId,
      content: text,
      timestamp: Date.now(),
    };
    sendMessage(message);
    setText("");
  };

  return (
    <div style={{padding:'20px'}}>
      <h3>
        Panel Admin (id: {idAdmin}) - {connected ? "✅ Conectado" : "❌ Desconectado"}
      </h3>

      {/* Bandeja de entrada */}
      <div
        style={{
          maxHeight: 300,
          overflow: "auto",
          border: "1px solid #ddd",
          padding: 8,
          marginBottom: '4px',
        }}
      >
        {messages.length === 0 && <p>No hay mensajes recibidos todavía.</p>}
        {messages.map((m, i) => (
          <div key={i} style={{ marginBottom: 8 }}>
            <b>{m.fromUserId}</b>{" "}
            <small>({new Date(m.timestamp).toLocaleString()})</small>
            <div>{m.content}</div>
          </div>
        ))}
      </div>

      {/* Formulario para enviar */}
      <br />
      <InputTextarea
        placeholder="Texto..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <br />
      <Button label="Enviar" Click={handleSend}/>
    </div>
  );
}
