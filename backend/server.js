/*const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session'); // Add this line to import express-session
const bcrypt = require('bcrypt');
const User = require('../user');
const apiRoutes = require('./routes/api');
const lalit = require('../app');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use('/api', apiRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, '../frontend')));

mongoose.connect('mongodb://localhost:27017/videoPlaylist', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
/*
// Authentication setup
app.use(express.urlencoded({ extended: false }));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

// Routes to serve HTML pages
app.get('/signup.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'signup.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'login.html'));
});

app.get('/home.html', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login.html');
    }
    res.sendFile(path.join(__dirname, 'frontend', 'home.html'));
});

// Signup route
app.post('/signup', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return res.redirect('/signup.html');
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.redirect('/login.html');
    } catch (err) {
        console.error(err);
        res.redirect('/signup.html');
    }
});

// Login route
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return res.redirect('/login.html');
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            console.log('Incorrect password');
            return res.redirect('/login.html');
        }
        req.session.user = user;
        console.log('Login successful');
        console.log('Session:', req.session);
        return res.redirect('/home.html');
    } catch (error) {
        console.error(error);
        res.redirect('/login.html');
    }
});

// Serve main page and user page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/Admin_create_playlist.html'));
});

app.get('/user', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/user.html'));
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});*/
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');
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

mongoose.connect('mongodb://localhost:27017/PathshalaDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});




app.get('/home', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/home1.html'));
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/home.html'));
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
