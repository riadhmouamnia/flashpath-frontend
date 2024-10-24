"use client";
import { useCallback, useEffect, useRef, useState } from "react";

export default function WebSocketReceiver({ username }: { username: string }) {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const connectWebSocket = () => {
      // Create WebSocket connection.
      const connection = new WebSocket(
        "wss://raw-data-sherif-flashpath-dev.deployments.quix.io/" + username
      );

      connection.onopen = () => {
        console.log("WebSocket connection established");
      };

      connection.onmessage = (event) => {
        console.log(event);
        setMessages((prevMessages) => [...prevMessages, event.data]);
      };

      connection.onerror = (error) => {
        console.error("WebSocket error: ", error);
      };

      connection.onclose = () => {
        console.log("WebSocket connection closed");
      };

      return connection;
    };
    const connection = connectWebSocket();

    return () => {
      connection.close();
    };
  }, [username]);

  return (
    <div>
      <h1>WebSocket Messages</h1>
      <ul>
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}
