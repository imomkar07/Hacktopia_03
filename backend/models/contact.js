const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    number: String,
    message: String,
}, {
    timestamps: true,
});

// Create a model
const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;