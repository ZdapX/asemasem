const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const Admin = require('../models/Admin');

// Halaman Home & Search
router.get('/', async (req, res) => {
    try {
        const { search } = req.query;
        let query = {};

        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { language: { $regex: search, $options: 'i' } }
                ]
            };
        }

        const projects = await Project.find(query).sort({ createdAt: -1 }).populate('authorId');
        const admins = await Admin.find({}); // Untuk section Chat Admin
        
        res.render('home', { projects, admins, search });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// Halaman Detail Proyek
router.get('/project/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id).populate('authorId');
        if (!project) return res.status(404).send("Project Not Found");
        res.render('detail', { project });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

// Real-time Like (API)
router.post('/like/:id', async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
        res.json({ success: true, likes: project.likes });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

// Real-time Download counter (API)
router.post('/download/:id', async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, { $inc: { downloads: 1 } }, { new: true });
        res.json({ success: true, downloads: project.downloads });
    } catch (err) {
        res.status(500).json({ success: false });
    }
});

module.exports = router;
