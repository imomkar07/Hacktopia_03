const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Playlist = require('../models/playlist');
const Profile = require('../models/Profile');
//const Profiling = require('../models/Profiling');

const router = express.Router();

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
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });
/*const upload = multer({
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
    storage: storage,
});*/
router.post('/upload', upload.fields([
    { name: 'playlistImage' },
    { name: 'videos' },
    { name: 'videoThumbnails' },
    { name: 'videoHeadings' } // Add video headings
]), async (req, res) => {
    try {
        const { playlistName, playlistDescription } = req.body;
        const playlistImage = req.files['playlistImage'][0];
        const videos = req.files['videos'];
        const videoThumbnails = req.files['videoThumbnails'];
        const videoHeadings = req.body['videoHeadings']; // Retrieve video headings from the request

        const videoData = videos.map((video, index) => ({
            filename: video.filename,
            contentType: video.mimetype,
            heading: videoHeadings[index], // Assign video heading
            thumbnail: videoThumbnails[index] ? {
                filename: videoThumbnails[index].filename,
                contentType: videoThumbnails[index].mimetype,
            } : null,
        }));

        const playlist = new Playlist({
            name: playlistName,
            description: playlistDescription,
            image: {
                filename: playlistImage.filename,
                contentType: playlistImage.mimetype,
            },
            videos: videoData,
        });

        await playlist.save();
        res.status(200).send('Playlist created successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});
router.get('/playlists', async (req, res) => {
    try {
        const playlists = await Playlist.find();
        res.json(playlists);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred');
    }
});
router.get('/playlists/:id', async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id).populate('videos');
        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }
        res.json(playlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});





router.put('/playlists/:id', upload.single('playlistImage'), async (req, res) => {
    try {
        const playlistId = req.params.id;
        const { playlistName, playlistDescription } = req.body;

        // Fetch the playlist from the database
        let playlist = await Playlist.findById(playlistId);

        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }

        // Update playlist properties
        playlist.name = playlistName || playlist.name;
        playlist.description = playlistDescription || playlist.description;

        // Handle playlist image
        if (req.file) {
            playlist.image = {
                filename: req.file.filename,
                contentType: req.file.mimetype
            };
        }

        // Save the updated playlist
        await playlist.save();

        console.log('Updated playlist:', playlist);

        res.status(200).json({ message: 'Playlist updated successfully', playlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while updating the playlist' });
    }
});

