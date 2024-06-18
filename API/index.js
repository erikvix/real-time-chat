const http = require("http").createServer();
const io = require("socket.io")(http, {
  cors: { origin: "*" },
});

// Função para emitir o número de clientes conectados
const emitClientCount = () => {
  const clientsCount = io.sockets.sockets.size;
  io.emit("clientsCount", clientsCount);
};

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  // Adiciona o usuário a uma sala chamada "chatRoom"
  socket.join("chatRoom");

  // Notifica todos na sala que um novo usuário entrou
  io.to("chatRoom").emit("message", `${socket.id} has joined the chat`);

  // Atualiza e emite o número de clientes conectados
  emitClientCount();

  // Recebe mensagens dos clientes e retransmite para todos na sala
  socket.on("message", (message) => {
    io.to("chatRoom").emit("message", `${socket.id}: ${message}`);
  });

  // Notifica todos na sala quando um usuário se desconecta
  socket.on("disconnect", () => {
    io.to("chatRoom").emit("message", `${socket.id} has left the chat`);
    console.log("user disconnected", socket.id);

    // Atualiza e emite o número de clientes conectados
    emitClientCount();
  });
});

http.listen(8080, () => console.log("listening on http://localhost:8080"));
