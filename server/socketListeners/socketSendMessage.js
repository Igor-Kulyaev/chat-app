const { Message } = require('../models/Message.js');
const { User } = require('../models/User.js');

function sendMessage(socket, io) {

    socket.on('sendMessage', async function (message) {

        const copiedMessage = message.trim();

        let document = { message: copiedMessage, username: socket.data.userData.username }

        try {
            const userSentMessage = await User.findOne({ UUID: socket.data.userData.UUID });
            if (userSentMessage.muted) {
                throw new Error('muted');
            }

            if (socket.data.userData.lastMessageTime && (socket.data.userData.lastMessageTime + 15000) > Date.now()) {
                socket.emit('timer', socket.data.userData.lastMessageTime)
                throw new Error('time')
            }

            if (copiedMessage.length === 0 || copiedMessage.length >= 200) {
                throw new Error('length')
            }

            let newMessage = await Message.create(document);
            io.emit('messages', newMessage);

            socket.data.userData.lastMessageTime = Date.now();
        } catch (error) {
            socket.emit('message-error', error.message)
        }
    })

}

module.exports = sendMessage;
