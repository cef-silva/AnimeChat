const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(express.static(path.join(__dirname, 'public')));

const adminName = 'AnimeChat Admin'

io.on('connection', socket => {
    socket.on('joinRoom', ({username,room}) => {
        const user = userJoin(socket.id, username, room);

        socket.join(user.room);

        socket.emit('message', formatMessage(adminName, 'Bem vindo ao AnimeChat!'));

        socket.broadcast
        .to(user.room)
        .emit('message', formatMessage(adminName, `${user.username} se juntou a conversa!`)
        );

        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
        });
    })

    socket.on('disconnect', () => {
        const user = userLeave(socket.id);

        if(user) {
            io.to(user.room).emit('message', formatMessage(adminName, `${user.username} saiu da conversa`));

            io.to(user.room).emit("roomUsers", {
                room: user.room,
                users: getRoomUsers(user.room),
            });
        }
    });

    socket.on('chatMessage', (msg) => {
        const user = getCurrentUser(socket.id);

        io.to(user.room).emit('message', formatMessage(user.username, msg));
    })
})

const PORT = 3000 || procces.env.PORT;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`))