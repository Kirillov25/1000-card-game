server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
app.use(express.static('public'));
const server = http.createServer(app);
const io = new Server(server);

const rooms = {}; // сюда будем сохранять состояние каждой комнаты

io.on('connection', (socket) => {
  console.log('Новое подключение:', socket.id);

  socket.on('startGame', ({ mode }) => {
    const roomId = socket.roomId || 'default'; // пока одна комната
    if (!rooms[roomId]) rooms[roomId] = {};

    const room = rooms[roomId];
    room.mode = mode;
    room.players = room.players || [];
    room.players.push(socket.id);

    console.log(`Запуск игры в комнате ${roomId} с режимом: ${mode}`);

    io.to(socket.id).emit('gameStarted', { mode });
    // Тут можно сразу запустить dealCards(roomId) и прочую механику
  });
});

server.listen(3000, () => {
  console.log('Сервер запущен на http://localhost:3000');
});
