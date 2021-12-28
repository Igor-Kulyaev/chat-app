const { User } = require('../models/User.js');

function banUser(socket, io) {

    socket.on('banUser', async function ({ UUID, banned }) {
        if (socket.data.userData.role === 'admin') {
            try {
                const user = await User.findOneAndUpdate({ UUID }, { banned: !banned });

                const suspected = (await io.fetchSockets()).find(item => item.data.userData.UUID === UUID);

                if (suspected) {
                    suspected.disconnect();
                }

                const allusers = await User.find();

                socket.emit('all-users', allusers);

            } catch (error) {
                socket.emit("back-error")
            }
        }
    })

}

module.exports = banUser;