const mongoose = require('mongoose');
const profilingSchema = new mongoose.Schema({
    profileImage: String,
    name: String,
    experience: String,
    profession: String,
});
const Profiling = mongoose.model('Profiling', profilingSchema);

module.exports = Profiling;

