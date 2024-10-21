// auth.js

/*const User = require('./user');
const bcrypt = require('bcryptjs');

module.exports.signup = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        if (password !== confirmPassword) {
            return res.redirect('/signup.html');
        }

        const user = new User({ name, email, username: email });
        await User.register(user, password);
        res.redirect('/login.html');
    } catch (err) {
        console.error(err);
        res.redirect('/signup.html');
    }
};*/
module.exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        console.log('Login request received with email:', email);
        const user = await User.findOne({ email });
        if (!user) {
            console.log('User not found for email:', email);
            return res.redirect('/login.html');
        }
        console.log('User found:', user);
        console.log('User password:', user.password); // Log the hashed password retrieved from the database
        const isValidPassword = await bcrypt.compare(password, user.password);
        console.log('IsValidPassword:', isValidPassword);
        if (!isValidPassword) {
            console.log('Incorrect password');
            return res.redirect('/login.html');
        }
        req.session.user = user;
        console.log('Session set:', req.session.user);
        return res.redirect('/home.html');
    } catch (error) {
        console.error('Login error:', error);
        res.redirect('/login.html');
    }
};
