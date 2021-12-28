const mongoose = require('mongoose');
require('dotenv').config();
const uniqid = require('uniqid')

function id() {
    return uniqid();
}

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: {
        type: String,
        default: 'user'
    },
    UUID: {
        type: String,
        default: id()
    },
    banned: {
        type: Boolean,
        default: false
    },
    muted: {
        type: Boolean,
        default: false
    }

});

const User = mongoose.model('user', userSchema);

module.exports = {
    User
}
