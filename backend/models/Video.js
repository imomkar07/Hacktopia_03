const mongoose = require('mongoose');

const videoSchemas = new mongoose.Schema({
    heading: String,
    videoPath: String,
    imagePath: String,
});
const Video = mongoose.model('Video', videoSchemas);

module.exports = Video;