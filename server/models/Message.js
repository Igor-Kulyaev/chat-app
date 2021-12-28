const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    username: String,
    message: String,
    date: { type: Date, default: Date.now }
});

const Message = mongoose.model('message', messageSchema);

module.exports = {
    Message
}
