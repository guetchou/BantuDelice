const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

let typingUsers = {};

io.on('connection', (socket) => {
  console.log('Nouvel utilisateur connecté:', socket.id);

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg); // broadcast à tous
  });

  socket.on('typing', (user) => {
    typingUsers[socket.id] = user;
    socket.broadcast.emit('typing', user);
  });
  socket.on('stop typing', (user) => {
    delete typingUsers[socket.id];
    socket.broadcast.emit('stop typing', user);
  });

  socket.on('disconnect', () => {
    console.log('Utilisateur déconnecté:', socket.id);
    delete typingUsers[socket.id];
    socket.broadcast.emit('stop typing');
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Serveur chat Socket.IO lancé sur http://localhost:${PORT}`);
}); 