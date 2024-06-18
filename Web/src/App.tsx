import React, { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

import "./App.css";

const socket: Socket = io("http://localhost:8080");

function App() {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState<string>("");
  const [clientsCount, setClientsCount] = useState<number>(0);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected to server", socket.id);
    });

    socket.on("message", (message: string) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    socket.on("clientsCount", (count: number) => {
      setClientsCount(count);
    });

    return () => {
      socket.off("message");
      socket.off("clientsCount");
    };
  }, []);

  const handleSendMessage = () => {
    if (input.trim()) {
      socket.emit("message", input);
      setInput("");
    }
  };

  return (
    <div>
      <div
        style={{
          width: "1080px",
          height: "720px",
          backgroundColor: "#e2e8f0",
          padding: "20px",
          boxSizing: "border-box",
          overflowY: "auto",
        }}
      >
        {messages.map((msg, index) => (
          <div style={{ color: "black" }} key={index}>
            {msg}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === "Enter") {
            handleSendMessage();
          }
        }}
        style={{
          width: "calc(100% - 22px)",
          padding: "10px",
          fontSize: "16px",
        }}
      />
      <button onClick={handleSendMessage}>Send</button>
      <div>
        <h3>Connected Users: {clientsCount}</h3>
      </div>
    </div>
  );
}

export default App;
