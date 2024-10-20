const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: String,
    contentType: String,
});

