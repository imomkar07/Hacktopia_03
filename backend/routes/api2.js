const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Playlist = require('../models/playlist');
const Message = require('../models/message');
const mongoose = require('mongoose');
const router = express.Router();
const Profiling = require('../models/Profiling');
const Contact = require('../models/contact');
let messages = {};
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage: storage });



router.post('/saveProfile', upload.single('profileImage'), async (req, res) => {
    try {
        const { name, experience, profession } = req.body;
        const profileImage = req.file.filename;

        const newProfile = new Profiling({
            profileImage,
            name,
            experience,
            profession,
        });

        await newProfile.save();
        res.status(201).send('Profile saved successfully');
    } catch (error) {
        console.error('Error saving profile:', error);
        res.status(500).send('Error saving profile');
    }
});

// Route to retrieve all profiles from MongoDB
router.get('/profiling', async (req, res) => {
    try {
        const profiles = await Profiling.find({});
        res.json(profiles);
    } catch (error) {
        console.error('Error fetching profiles:', error);
        res.status(500).send('Error fetching profiles');
    }
});

router.delete('/profiling/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const deletedProfile = await Profiling.findByIdAndDelete(id);
        if (!deletedProfile) {
            return res.status(404).json({ message: 'Profile not found' });
        }
        res.json({ message: 'Profile deleted successfully' });
    } catch (error) {
        console.error('Error deleting profile:', error);
        res.status(500).json({ message: 'Error deleting profile' });
    }
});




// Route to get messages for a specific profile
router.get('/messages/:profileId', async (req, res) => {
    try {
        const messages = await Message.find({ profileId: req.params.profileId });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve messages' });
    }
});

// Route to send a new message
router.post('/messages/send', async (req, res) => {
    const { profileId, content } = req.body;
    if (!profileId || !content) {
        return res.status(400).json({ error: 'Profile ID and content are required' });
    }
    try {
        const newMessage = new Message({
            profileId,
            content
        });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ error: 'Failed to send message' });
    }
});


router.post('/contact', async (req, res) => {
    const { name, email, number, message } = req.body;

    // Validate number length
    if (number.length !== 10) {
        return res.status(400).json({ message: 'Phone number must be 10 digits long' });
    }

    const newContact = new Contact({ name, email, number, message });

    try {
        const savedContact = await newContact.save();
        res.status(201).json({ message: 'Contact saved', data: savedContact });
    } catch (error) {
        res.status(500).json({ message: 'Failed to save contact', error });
    }
});

router.get('/contacts', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch contacts', error });
    }
});

router.delete('/contacts/:id', async (req, res) => {
    try {
        const contactId = req.params.id;
        await Contact.findByIdAndDelete(contactId);
        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete message' });
    }
});

module.exports = router;
