function logout(socket, io) {

    socket.on('logout', async (id) => {
        try {

            const socketUser = (await io.fetchSockets()).find(item => item.id === id);

            if (socketUser) {
                socketUser.disconnect();
                const allsockets = (await io.fetchSockets()).map(item => item.data);
                socket.broadcast.emit('present-users', allsockets)
            }

        } catch (error) {
            socket.emit("back-error")
        }
    })
}

module.exports = logout;