const http = require("http").createServer();
const io = require("socket.io")(http, {
  cors: { origin: "*" },
});

// Função para emitir o número de clientes conectados
const emitClientCount = () => {
  const clientsCount = io.sockets.sockets.size;
  io.emit("clientsCount", clientsCount);
};

const chatHistory = [];

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  socket.join("chatRoom");
  
  socket.emit("chatHistory", chatHistory);

  io.to("chatRoom").emit("message", `${socket.id} has joined the chat`);

  emitClientCount();

  socket.on("message", (message) => {
    chatHistory.push({ id: socket.id, message });
    io.to("chatRoom").emit("message", `${socket.id}: ${message}`);
    console.log("All messages", chatHistory);
  });

  socket.on("disconnect", () => {
    io.to("chatRoom").emit("message", `${socket.id} has left the chat`);
    console.log("user disconnected", socket.id);

    emitClientCount();
  });
});

http.listen(8080, () => console.log("listening on http://localhost:8080"));
