const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const apiRoutes = require('./backend/routes/api2');
const app2 = express();
app2.use('/api2', apiRoutes);
// MongoDB connection setup
/*mongoose.connect('mongodb://localhost:27017/profiles', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});*/
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});


app2.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app2.use(express.static(path.join(__dirname, '../frontend')));
// Profile schema and model


// Multer setup for file upload
const upload = multer({
    dest: 'uploads/',
    limits: {
        fileSize: 2 * 1024 * 1024, // 2MB file size limit
    },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb('Error: Images only!');
        }
    },
});

// Express middleware to serve static files and handle JSON bodies

app2.use(express.json());

// Route to handle form submission and save profile to MongoDB


app2.get('/teacher', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/Admin_teacher.html'));
});

app2.get('/teachers', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/teacher_profile.html'));
});

app2.get('/teach', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/Admin_teacher_create_receive.html'));
});

app2.get('/teach_delete', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/Admin_teacher_delete.html'));
});

module.exports = app2;