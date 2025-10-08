import React, { useState, useEffect} from "react";
import usePrivateChat from "../../services/UsePrivateChat";
import { getChatHistory, getUserConversations } from "../../services/ChatService";
import { Avatar } from 'primereact/avatar';
import { Badge } from 'primereact/badge';
import { Fieldset } from 'primereact/fieldset';
import { Card } from 'primereact/card';
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { useLocation } from "react-router-dom";

export default function UserInbox() {
  const location = useLocation();
  const state = location.state || {};

  // soporta varias claves por si tu navigate usó `username`, `userName` o `autorNombre`
  const autorIdRaw = state.autorId ?? state.userId ?? state.user?.id;
  const autorNombre = state.autorNombre ?? state.userName ?? state.username ?? state.user?.name;

  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [replyText, setReplyText] = useState("");
  const [activeChat, setActiveChat] = useState(null);
  const [unreadMessages, setUnreadMessages] = useState({});

  // parsea el id del usuario logueado a número
  const idUser = parseInt(localStorage.getItem("id"), 10);


  // Hook para recibir mensajes en tiempo real
  const { connected, sendMessage } = usePrivateChat(idUser, (msg) => {
    setMessages((prev) => [...prev, msg]);

    // si el mensaje es de otro usuario y no está activo en ese chat
    if (msg.fromUserId !== idUser && msg.fromUserId !== activeChat?.otherUserId) {
      setUnreadMessages((prev) => ({
        ...prev,
        [msg.fromUserId]: (prev[msg.fromUserId] || 0) + 1
      }));
    }
  });

  const usuarioLogueado = localStorage.getItem("username");

  const legend = (
    <h3 style={{ color: "gray", margin: '10px' }}>
      Inbox de {usuarioLogueado} - {connected ? "✅ Conectado" : "❌ Desconectado"}
    </h3>
  );

  // 1) Cargar conversaciones al inicio
  useEffect(() => {
    if (!idUser || Number.isNaN(idUser)) return;
    let mounted = true;
    getUserConversations(idUser).then(data => {
      if (!mounted) return;
      setConversations(Array.isArray(data) ? data : []);
    }).catch(err => console.error(err));
    return () => { mounted = false; }
  }, [idUser]);

  // 2) Cargar historial cuando cambia el chat activo
  useEffect(() => {
    if (!activeChat) return;
    getChatHistory(idUser, activeChat.otherUserId)
      .then(setMessages)
      .catch(err => console.error("Error cargando historial:", err));
  }, [activeChat, idUser]);

  // 3) Abrir/crear conversación cuando llegas por navigate con autorId
  // - NO dependemos de `conversations` para evitar loops.
useEffect(() => {
  if (!autorIdRaw || !autorNombre) return;

  const autorId = parseInt(autorIdRaw, 10);
  if (Number.isNaN(autorId)) return;

  // usamos updater funcional para leer el estado actual sin añadir conversations a deps
  setConversations(prev => {
    const existing = prev.find(conv => parseInt(conv.otherUserId, 10) === autorId);

    if (existing) {
      // si ya existe la conversación, la movemos al inicio
      const updated = prev.map(conv =>
        parseInt(conv.otherUserId, 10) === autorId
          ? { ...conv, timestamp: Date.now() }
          : conv
      );
      setActiveChat(existing);
      // orden descendente por timestamp
      return updated.sort((a, b) => b.timestamp - a.timestamp);
    }

    // si no existe, creamos una nueva conversación
    const newConv = {
      otherUserId: autorId,
      otherUserName: autorNombre,
      lastMessage: "",
      timestamp: Date.now(),
    };
    setActiveChat(newConv);

    // añadimos la nueva conversación y ordenamos
    return [newConv, ...prev].sort((a, b) => b.timestamp - a.timestamp);
  });
}, [autorIdRaw, autorNombre]);


  // enviar respuesta manual (cuando el usuario presiona el botón)
  const handleReply = () => {
    if (!replyText || !activeChat) return;
    const message = {
      fromUserId: idUser,
      toUserId: activeChat.otherUserId,
      content: replyText,
      timestamp: Date.now(),
    };

    sendMessage(message);
    setMessages(prev => [...prev, message]);

    setConversations(prevConversations => {
      const updated = prevConversations.map(conv =>
        parseInt(conv.otherUserId, 10) === activeChat.otherUserId
          ? { ...conv, lastMessage: message.content, timestamp: message.timestamp }
          : conv
      );
      return updated.sort((a, b) => b.timestamp - a.timestamp);
    });

    setReplyText("");
  };

  const handleSelectChat = (conv) => {
    setActiveChat(conv);
    setUnreadMessages(prev => ({ ...prev, [conv.otherUserId]: 0 }));
  };

  return (
    <div className="chat" style={{ display: "flex", gap: "1rem", width: '1200px', height: '100vh', marginTop: '100px' }}>
      <Fieldset legend={legend} style={{ width: '1000px' }}>
        <div style={{ flex: 1, padding: "8px" }}>
          {activeChat ? (
            <>
              <h4 className="mt-2 mb-3">{activeChat.otherUserName}</h4>
              <div style={{ maxHeight: 300, overflow: "auto", border: "1px solid #ddd", padding: 8, marginBottom: 12 }}>
                {messages.map((m, i) => {
                  const isOwn = parseInt(m.fromUserId, 10) === idUser;
                  const fechaComentario = new Date(m.timestamp);
                  const hoy = new Date();
                  const esHoy = fechaComentario.getDate() === hoy.getDate() &&
                                fechaComentario.getMonth() === hoy.getMonth() &&
                                fechaComentario.getFullYear() === hoy.getFullYear();
                  const fechaFormateada = esHoy
                    ? fechaComentario.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: true })
                    : fechaComentario.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric', hour:'2-digit', minute:'2-digit', hour12:true });

                  return (
                    <div key={i} style={{ display: "flex", justifyContent: isOwn ? "flex-end" : "flex-start", marginBottom: "10px" }}>
                      <Card style={{ backgroundColor: isOwn ? "#DCF8C6" : "#FFF", color: "#333", padding: "8px 12px", borderRadius: "12px", maxWidth: "60%", boxShadow: "0 1px 3px rgba(0,0,0,0.1)", textAlign: "left" }}>
                        <div>{m.content}</div>
                        <small>{fechaFormateada}</small>
                      </Card>
                    </div>
                  );
                })}
              </div>

              <div style={{ display: 'flex', flexDirection: 'row', gap: '5px' }}>
                <InputText placeholder="Escribe tu respuesta..." value={replyText} onChange={(e) => setReplyText(e.target.value)} style={{ width: "95%", height: 45, marginTop: 10 }} />
                <Button icon='pi pi-send' onClick={handleReply} style={{ marginTop: 10, height: 45 }} />
              </div>
            </>
          ) : <p>Selecciona una conversación para chatear</p>}
        </div>
      </Fieldset>

      <Fieldset>
        <div style={{ width: "300px", borderRight: "1px solid #ddd", padding: "8px" }}>
          <h4 style={{ color: 'gray', margin: '10px', marginBottom: '20px' }}>Conversaciones</h4>
          {conversations.map((conv, i) => (
            <div key={i} style={{ padding: "8px", cursor: "pointer", display: 'flex', flexDirection: 'column', background: activeChat?.otherUserId === conv.otherUserId ? "#f0f0f0" : "transparent" }} onClick={() => handleSelectChat(conv)}>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '0.5rem', marginBottom: '10px' }}>
                <div className="p-overlay-badge mr-3" style={{ position: 'relative', display: 'inline-block' }}>
                  <Avatar label={conv.otherUserName?.charAt(0).toUpperCase()} style={{ backgroundColor: '#9c27b0', color: '#ffffff' }} shape="circle" />
                  {unreadMessages[conv.otherUserId] > 0 && <Badge value={unreadMessages[conv.otherUserId]} severity="danger" style={{ position: 'absolute', top: '-3px', right: '-3px', borderRadius: '50%', fontSize: '0.7rem', padding: '2px 5px' }} />}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <b style={{ color: 'gray' }}>{conv.otherUserName}</b>
                  <div style={{ fontSize: "0.9em", color: "#555", marginBottom: '10px' }}>{conv.lastMessage}</div>
                </div>
              </div>
              <small style={{ color: 'gray' }}>{new Date(conv.timestamp).toLocaleString()}</small>
            </div>
          ))}
        </div>
      </Fieldset>
    </div>
  );
}
