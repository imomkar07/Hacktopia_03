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


router.put('/playlists/:id/videos', upload.array('videos'), async (req, res) => {
    try {
        const playlistId = req.params.id;

        // Fetch the playlist from the database
        let playlist = await Playlist.findById(playlistId);

        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }

        // Handle video files
        if (req.files && req.files.length > 0) {
            const videos = req.files.map(file => ({
                filename: file.filename,
                contentType: file.mimetype,
                heading: req.body.headings ? req.body.headings[req.files.indexOf(file)] : "Untitled Video"
            }));
            playlist.videos = playlist.videos.concat(videos); // Append the new videos to the existing playlist videos
        }

        // Save the updated playlist
        await playlist.save();

        console.log('Updated playlist with new videos:', playlist);

        res.status(200).json({ message: 'Videos added to playlist successfully', playlist });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while adding videos to the playlist' });
    }
});


router.get('/profile', async (req, res) => {
    try {
        const profile = await Profile.findById('60c72b2f9b1e8c3d4c8b4567'); // Replace with the actual profile ID
        res.json(profile);
    } catch (error) {
        res.json({ success: false, error });
    }
});

// Endpoint to update profile data
router.post('/update_profile', upload.single('profilePic'), async (req, res) => {
    const { name, email } = req.body;
    const profilePic = req.file ? req.file.path : '';

    try {
        const profile = await Profile.findByIdAndUpdate(
            '60c72b2f9b1e8c3d4c8b4567', // Replace with the actual profile ID
            { name, email, profilePic },
            { new: true, upsert: true }
        );
        res.json({ success: true, profile });
    } catch (error) {
        res.json({ success: false, error });
    }
});





router.delete('/playlists/:playlistId', async (req, res) => {
    const playlistId = req.params.playlistId;
    try {
        // Find the playlist by ID and delete it
        await Playlist.findByIdAndDelete(playlistId);
        res.status(200).send('Playlist deleted successfully!');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while deleting the playlist.');
    }
});

router.get('/:playlistId', async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.playlistId);
        if (!playlist) {
            return res.status(404).json({ message: 'Playlist not found' });
        }
        res.json(playlist);
    } catch (error) {
        console.error('Error fetching playlist details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});





router.post('/update', upload.fields([{ name: 'playlistImage', maxCount: 1 }, { name: 'videos', maxCount: 10 }, { name: 'videoThumbnails', maxCount: 10 }, { name: 'videoHeadings' }]), async (req, res) => {
    /*const { playlistName, playlistDescription, videoHeadings } = req.body;
    const playlistImage = req.files['playlistImage'] ? req.files['playlistImage'][0] : null;
    const videos = req.files['videos'];
    const videoThumbnails = req.files['videoThumbnails'];*/

    try {
        const { playlistName, playlistDescription } = req.body;
        const playlistImage = req.files['playlistImage'][0];
        const videos = req.files['videos'];
        const videoThumbnails = req.files['videoThumbnails'];
        const videoHeadings = req.body['videoHeadings'];
        // Find the playlist in the database by its name
        const existingPlaylist = await Playlist.findOne({ name: playlistName });

        if (!existingPlaylist) {
            // If the playlist doesn't exist, return an error
            return res.status(404).json({ success: false, message: 'Playlist not found' });
        }

        // Update the playlist details
        existingPlaylist.description = playlistDescription;

        // Update the playlist image if provided
        if (playlistImage) {
            existingPlaylist.image = { filename: playlistImage.filename, path: playlistImage.path };
        }

        // Update video details
        for (let i = 0; i < videos.length; i++) {
            existingPlaylist.videos.push({
                filename: videos[i].filename, // Use filename instead of videoUrl
                contentType: videos[i].mimetype, // Use contentType instead of videoUrl
                heading: videoHeadings[i],
                thumbnail: videoThumbnails[i] ? {
                    filename: videoThumbnails[i].filename,
                    contentType: videoThumbnails[i].mimetype,
                } : null,
            });
        }

        // Save the updated playlist to the database
        await existingPlaylist.save();

        // Send a success response
        res.status(200).json({ success: true, message: 'Playlist updated successfully' });
    } catch (error) {
        console.error('Error updating playlist:', error);
        res.status(500).json({ success: false, message: 'An error occurred while updating the playlist' });
    }
});



router.delete('/playlists/:playlistId/videos/:videoId', async (req, res) => {
    const { playlistId, videoId } = req.params;
    try {
        console.log(`Attempting to delete video with ID: ${videoId} from playlist: ${playlistId}`);

        // Find the playlist by ID and update it by pulling the video from the videos array
        const result = await Playlist.findByIdAndUpdate(
            playlistId,
            { $pull: { videos: { _id: videoId } } },
            { new: true }
        );

        if (!result) {
            console.log('Playlist or video not found.');
            return res.status(404).send({ message: 'Playlist or video not found.' });
        }

        console.log(`Video with ID: ${videoId} removed from playlist: ${playlistId}`);
        res.status(200).send({ message: 'Video deleted successfully.' });
    } catch (error) {
        console.error('Error deleting video:', error);
        res.status(500).send({ message: 'Failed to delete video.', error });
    }
});




// tutor api

/*router.get('/tutor-profiles', async (req, res) => {
    try {
        const tutor = await Tutor.find();
        res.json(tutor);
    } catch (err) {
        console.error('Error fetching tutor profiles:', err);
        res.status(500).send('Server error');
    }
});

router.get('/api/tutor-profiles/:tutorId', async (req, res) => {
    const { tutorId } = req.params;
    try {
        const profile = await TutorProfile.findById(tutorId);
        if (!profile) {
            res.status(404).send('Tutor profile not found');
            return;
        }
        res.json(profile);
    } catch (error) {
        console.error('Error fetching tutor profile by tutorId:', error);
        res.status(500).send('Error fetching tutor profile');
    }
});


router.post('/add-tutor-profile', upload.single('photo'), (req, res) => {
    const { name, profession, experience } = req.body;
    const photo = req.file;

    // Validate and process the received data...
    if (!name || !profession || !experience || !photo) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Simulate saving to a database and responding with the new profile
    const newProfile = {
        name,
        photo: `/uploads/${photo.filename}`, // Path to saved photo
        profession,
        experience,
    };

    res.status(201).json(newProfile);
});*/






/*router.post('/saveProfile', upload.single('profileImage'), async (req, res) => {
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
router.get('/profile/:profileId', async (req, res) => {
    try {
        // Extract profileId from the request parameters
        const profileId = req.params.profileId;

        // Fetch the profile from the database by ID
        const profile = await Profiling.findById(profileId);

        // If no profile is found, return a 404 response
        if (!profile) {
            return res.status(404).json({ message: 'Profile not found' });
        }

        // Return the profile data in the response
        res.json(profile);
    } catch (error) {
        console.error('Error fetching profile details:', error);

        // Check if the error is due to an invalid ObjectId format
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: 'Invalid profile ID' });
        }

        // For other errors, return a generic 500 response
        res.status(500).json({ message: 'Internal server error' });
    }
});*/




module.exports = router;