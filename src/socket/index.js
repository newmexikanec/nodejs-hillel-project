const {messageService} = require("../services");

module.exports = (io, socket) => {
    socket.on('join', id => {
        socket.join(id);// subscribe chat room
        socket.myRoom = id;
    });
    socket.on('disconnecting', async () => {
        socket.leave(socket.myRoom);// unsubscribe chat room
    });

    socket.on('sendMessage', async ({text, senderID}) => {
        const sockets = await io.in(socket.myRoom).fetchSockets();//TODO now this feature works only for 2 users
        await messageService.create({
            text,
            chatID: socket.myRoom,
            senderID,
            isRead: sockets.length === 2 ? true : false
        });
        io.to(socket.myRoom).emit('getMessage', {
            text, senderID
        });
    });
}
