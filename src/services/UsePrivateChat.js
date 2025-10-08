import { useEffect, useRef, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";

export default function usePrivateChat(userId, maybeOtherOrOnMessage, maybeOnMessage) {
  // Compatibilidad: (userId, onMessage) o (userId, otherUserId, onMessage)
  let otherUserId = "1"; // por defecto (ajusta si tu admin tiene otro id)
  let onMessage = null;
  if (typeof maybeOtherOrOnMessage === "function") {
    onMessage = maybeOtherOrOnMessage;
  } else {
    otherUserId = maybeOtherOrOnMessage || otherUserId;
    onMessage = maybeOnMessage;
  }

  const clientRef = useRef(null);
  const subscriptionRef = useRef(null);
  const onMessageRef = useRef(onMessage); // guardamos la última función sin recrear efecto
  const loadedKeyRef = useRef(null); // controla la carga del historial por par (userId:otherUserId)
  const [connected, setConnected] = useState(false);

  // Mantener la referencia a la última onMessage
  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!userId) return;

    const key = `${userId}:${otherUserId}`;

    // 1) Cargar historial solo si no está ya cargado para este par
    if (loadedKeyRef.current !== key) {
      loadedKeyRef.current = key;
      fetch(`http://localhost:8080/api/chat/history/${userId}/${otherUserId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Error cargando historial: " + res.status);
          return res.json();
        })
        .then((data) => {
          if (Array.isArray(data)) {
            data.forEach((msg) => onMessageRef.current?.(msg));
          } else {
            console.warn("Historial no es array:", data);
          }
        })
        .catch((err) => {
          console.error("Fetch historial fallo:", err);
        });
    }

    // Si ya hay un client activo para este hook, no crear otro
    if (clientRef.current?.active) {
      return () => {};
    }

    // 2) Crear y activar cliente STOMP/SockJS
    const client = new Client({
      webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      // desactivar debug por defecto; si quieres logs pon una función
      debug: () => {},
      onConnect: () => {
        console.log("✅ Conectado a WebSocket");
        setConnected(true);

        // Suscribirse y guardar referencia para desuscribir después
        try {
          subscriptionRef.current = client.subscribe(`/topic/private.${userId}`, (msg) => {
            if (!msg.body) return;
            try {
              const data = JSON.parse(msg.body);
              onMessageRef.current?.(data);
            } catch (err) {
              console.error("Error parseando msg.body:", err, msg.body);
            }
          });
        } catch (err) {
          console.error("Error suscribiendo:", err);
        }
      },
      onStompError: (frame) => {
        console.error("❌ Broker error:", frame);
      },
      onWebSocketError: (err) => {
        console.error("⚠️ WebSocket error:", err);
      },
      onDisconnect: () => {
        setConnected(false);
      },
    });

    clientRef.current = client;
    client.activate();

    // cleanup
    return () => {
      try {
        subscriptionRef.current?.unsubscribe?.();
        subscriptionRef.current = null;
      } catch (err) {
        console.warn("Error desuscribiendo:", err);
      }

      if (clientRef.current?.active) {
        clientRef.current.deactivate();
      }
      // NOTA: no reseteamos loadedKeyRef para permitir que si el componente se vuelve
      // a montar (con mismo userId:otherUserId) no vuelva a cargar historial.
    };
  }, [userId, otherUserId]); // re-ejecuta solo si cambia userId u otherUserId

  const sendMessage = (message) => {
    const client = clientRef.current;
    if (!client || !client.active) {
      console.warn("STOMP no activo - no se pudo enviar el mensaje");
      return;
    }
    try {
      client.publish({
        destination: "/app/chat.private",
        body: JSON.stringify(message),
      });
    } catch (err) {
      console.error("Error publicando mensaje:", err);
    }
  };

  return { connected, sendMessage };
}
