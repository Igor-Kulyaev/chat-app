const express = require('express');
const { User } = require('../models/User.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { resultsValidator } = require('../validator.js')
const uniqid = require('uniqid')
require('dotenv').config();
const accessTokenSecret = 'youraccesstokensecret';

const app = express();

app.use(express.json({ extended: true }));

let authContr = async (req, res, next) => {
    res.header("Access-Control-Allow-Origin", 'http://localhost:3000');

    try {
        const errors = resultsValidator(req)

        if (errors.length > 0) {
            return res.status(400).json({
                method: req.method,
                status: res.statusCode,
                error: errors
            })
        }

        const dbCount = await User.count();

        let { password, username } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt)

        const user = await User.findOne({ username });

        if (user) {

            if (user.banned) {
                return (res.status(401).json({ "error": "banned user" }))
            }

            const pass = await bcrypt.compare(password, user.password);

            if (pass) {
                const token = jwt.sign({ username: user.username, UUID: user.UUID }, accessTokenSecret);
                return res.json({ token })
            } else {
                return (res.status(401).json({ "error": "invalid credentials" }))
            }

        }

        const role = dbCount ? 'user' : 'admin';

        const payload = {
            username,
            password: hashedPassword,
            UUID: uniqid(),
            role
        }
        await User.create(payload)
            .then(({ username, UUID }) => {
                const token = jwt.sign({ username: username, UUID: UUID }, accessTokenSecret);
                return res.json({ token })
            })
            .catch(error => {
                res.status(500).json({ "error": "server error" })
            })

    } catch (error) {
        res.status(500).json({ "error": "server error" })
    }

}

module.exports = { authContr };
