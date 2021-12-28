const express = require('express');
const { main } = require('./mongoose.js');
const { User } = require('./models/User.js');
const jwt = require('jsonwebtoken');
const accessTokenSecret = 'youraccesstokensecret';
const routes = require('./routes/authroute');
const socketSendMessage = require('./socketListeners/socketSendMessage');
const socketDisconnect = require('./socketListeners/socketDisconnect');
const socketFirstConnect = require('./socketListeners/socketFirstConnection');
const socketBanUser = require('./socketListeners/socketBanUser');
const socketMuteUser = require('./socketListeners/socketMuteUser');
const socketLogout = require('./socketListeners/socketLogout');
require('dotenv').config()
const { createServer } = require("http");
const { Server } = require("socket.io");
let cors = require('cors');

const app = express();
const port = 4000;
app.use(cors({
    origin: 'http://localhost:3000'
}))
app.use(express.json({ extended: true }))
app.use('/', routes);

const httpServer = createServer(app);
const io = new Server(httpServer, { cors: true });

io.use(async (socket, next) => {

    try {

        let token = socket.handshake.auth.token;
        let decoded = jwt.verify(token, accessTokenSecret);
        const allsockets = await io.fetchSockets();

        let newUser = await User.findOne({ UUID: decoded.UUID });
        socket.data.userData = newUser;

        if (!newUser || newUser.banned) {
            socket.data.userData.disconnect();
            return;
        }

        const presentUser = allsockets.find(item => item.data.userData.UUID === newUser.UUID);

        if (presentUser) {
            presentUser.disconnect();
        }

        next();

    } catch (err) {

        console.error(err)

    }
});

io.on("connection", async (socket) => {

    socketBanUser(socket, io);

    socketMuteUser(socket, io);

    socketLogout(socket, io);

    socketFirstConnect(socket, io);

    socketSendMessage(socket, io);

    socketDisconnect(socket, io);
});

httpServer.listen(port, () => {
    main()
        .then(console.log('Connected to BD'))
        .catch(err => console.log(err))
});
