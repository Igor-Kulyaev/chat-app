const mongoose = require('mongoose');

exports.mongoose = mongoose;

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb+srv://myapp:myapp123@cluster0.g4vvq.mongodb.net/myapp?retryWrites=true&w=majority');
}

exports.main = main;
