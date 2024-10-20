const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
    filename: String,
    contentType: String,
});
const videoSchema = new mongoose.Schema({
    filename: String,
    contentType: String,
    heading: String, // Add a new field for video heading
    thumbnail: fileSchema,
});

