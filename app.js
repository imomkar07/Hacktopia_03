// /design/app.js

const express = require('express');
const mongoose = require('mongoose');
const User = require('./backend/models/user');
const path = require('path');
const bcrypt = require('bcryptjs');
const session = require('express-session');

const app = express();

// Connect to MongoDB
//mongoose.connect('mongodb://localhost:27017/LoginSign', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(session({ secret: 'secret', resave: false, saveUninitialized: true }));

// Routes to serve HTML pages
app.get('/signup.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'signup.html'));
});

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend', 'login.html'));
});

app.get('/home1.html', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login.html');
    }
    res.sendFile(path.join(__dirname, 'frontend', 'home1.html'));
});

// Signup route
app.post('/signup', async (req, res) => {
    const { name, email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
        return res.redirect('/signup.html');
    }

    try {
        const user = new User({ name, email, password });
        await user.save();
        res.redirect('/login.html');
    } catch (err) {
        console.error(err);
        res.redirect('/signup.html');
    }
});

// Login route
/*app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            // User not found
            return res.redirect('/login.html');
        }
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            // Incorrect password
            return res.redirect('/login.html');
        }
        req.session.user = user;
        return res.redirect('/create.html');
    } catch (error) {
        console.error(error);
        res.redirect('/login.html');
    }
});*/

app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            // User not found
            return res.redirect('/login.html');
        }

        // Check if user is admin
        if (email === "admin@gmail.com" && password === "admin") {
            return res.redirect('/Admin_page.html');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            // Incorrect password
            return res.redirect('/login.html');
        }

        req.session.user = user;
        return res.redirect('/create.html');
    } catch (error) {
        console.error(error);
        res.redirect('/login.html');
    }
});

// Start the server
/*app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});*/
module.exports = app;
