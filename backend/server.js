const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcrypt');
const User = require('./models/user');
const apiRoutes = require('./routes/api');
const apiRoutes2 = require('./routes/api2');
const app = require('../app');
const newone = require('../app2');






//const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/api', apiRoutes);
app.use('/api2', apiRoutes2);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.static(path.join(__dirname, '../frontend/css')));

mongoose.connect('mongodb://localhost:27017/videoPlaylist', /*{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}*/);




app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/home.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/home1.html'));
});

app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/user.html'));
});


// Route to serve create page
app.get('/create', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/create.html'));
});

/*app.get('/profile', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/profile-section.html'));
});


app.get('/add', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/Admin_watch_video.html'));
});*/

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/contact.html'));
});

app.get('/contact_admin', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/Admin_recive_contact.html'));
});


// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
