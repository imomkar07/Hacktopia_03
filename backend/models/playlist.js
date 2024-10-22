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

const playlistSchema = new mongoose.Schema({
    name: String,
    description: String,
    image: fileSchema,
    videos: [videoSchema],
});

const Playlist = mongoose.model('Playlist', playlistSchema);

module.exports = Playlist;
