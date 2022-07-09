const { Chat } = require('../Models/Chat');
const jwt = require("jsonwebtoken");

const parseCookie = str =>
  str
  .split(';')
  .map(v => v.split('='))
  .reduce((acc, v) => {
    acc[decodeURIComponent(v[0].trim())] = decodeURIComponent(v[1].trim());
    return acc;
  }, {});

exports.socketIOConfig = function (http) {
    var rooms = []

    var io = require('socket.io')(http, {
        cors: {
            credentials: true,
            origin: 'http://localhost',
        }
    });

    io.use((socket, next) => {
        var cookies = parseCookie(socket.handshake.headers.cookie)
        if (cookies['token']) {
            try {
                const user = jwt.verify(cookies['token'], process.env.JWT_SECRETKEY);
                next();
            } catch {
                next(new Error("Invalid token"))
            }
        } else {
            next(new Error("No token"));
        }
    })

    io.on('connection', (socket) => { /* socket object may be used to send specific messages to the new connected client */
        console.log(`Client ${socket.id} connected !`)
        socket.emit('connection', null);

        socket.on("join room", roomId => {
            var index = null
            rooms.map((room, roomIndex) => {
                if (room.id === roomId) index = roomIndex
            })
            if (index === null) {
                console.log(`Creating new room with id = ${roomId}`);
                var newRoom = {
                    id: roomId,
                    users: [socket.id]
                }
                rooms.push(newRoom)
            } else {
                console.log(`Adding user ${socket.id} to room ${roomId}`);
                if (!rooms[index].users.includes(roomId)) rooms[index].users.push(socket.id)
            }
        })

        socket.on("leave room", roomId => {
            var index = rooms.findIndex(x => x.users.includes(socket.id));
            if (index !== -1) {
                rooms[index].users.splice(rooms[index].users.indexOf(socket.id), 1);
            } 
        })

        socket.on("message", message => {
            
            var cookies = parseCookie(socket.handshake.headers.cookie)
            const sender = jwt.verify(cookies['token'], process.env.JWT_SECRETKEY);
            var index = rooms.findIndex(x => x.users.includes(socket.id));
            console.log("🚀 ~ file: socketIOConfig.js ~ line 68 ~ io.on ~ rooms", rooms)
            console.log(`Received message from user ${sender.userId} containing ${message.message}`);
            var newChat = new Chat({
                senderID: sender.userId,
                roomID: rooms[index].id,
                message: message.message
            });
            newChat.save();
            message['senderID'] = {}
            message['senderID']['firstName'] = sender.firstName;
            message['senderID']['lastName'] = sender.lastName;
            for (var user of rooms[index].users) {
                io.to(user).emit("newMessage", message);
            }
        });

        
    });

}