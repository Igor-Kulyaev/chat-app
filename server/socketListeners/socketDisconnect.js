function disconnect(socket, io) {

    socket.on("disconnect", async (reason) => {
        const allsockets = (await io.fetchSockets()).map(item => item.data);
        socket.broadcast.emit('present-users', allsockets);
    });
}

module.exports = disconnect;
