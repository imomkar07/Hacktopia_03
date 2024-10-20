const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
    profileId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profiling',
        required: true
    },