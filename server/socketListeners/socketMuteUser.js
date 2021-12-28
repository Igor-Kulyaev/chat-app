const { User } = require('../models/User.js');

function muteUser(socket, io) {

    socket.on('muteUser', async function (data) {
        if (socket.data.userData.role === 'admin') {
            try {
                const user = await User.findOneAndUpdate({ UUID: data.UUID }, { muted: !data.muted });

                const socketUser = (await io.fetchSockets()).find(item => item.data.userData.UUID === data.UUID);

                if (socketUser) {
                    socketUser.muted = !data.muted;
                    socketUser.emit('updateMute', socketUser.muted)
                }

                const allusers = await User.find();

                socket.emit('all-users', allusers);

            } catch (error) {
                socket.emit("back-error", error.message)
            }
        }
    })
}

module.exports = muteUser;