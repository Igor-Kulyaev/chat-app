const { Message } = require('../models/Message.js');
const { User } = require('../models/User.js');

async function socketFirstConnect(socket, io) {
    const messagesDb = await Message.find().sort({ date: 1 }).limit(20);
    const allsockets = (await io.fetchSockets()).map(item => item.data);

    socket.emit('youConnected', {
        id: socket.data.userData.UUID,
        username: socket.data.userData.username,
        muted: socket.data.userData.muted
    });

    socket.emit("messages", messagesDb);
    io.emit('present-users', allsockets);

    if (socket.data.userData.role === 'admin') {
        const allusers = await User.find();
        socket.emit('all-users', allusers);
    }
}

module.exports = socketFirstConnect;
