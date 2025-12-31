const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const Project = require('../models/Project');

// Middleware untuk proteksi halaman admin
const isAdmin = (req, res, next) => {
    if (req.session.adminId) return next();
    res.redirect('/admin/login');
};

// Halaman Login
router.get('/login', (req, res) => {
    if (req.session.adminId) return res.redirect('/admin/dashboard');
    res.render('admin/login');
});

// Proses Login (Hardcoded check)
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username, password });

    if (admin) {
        req.session.adminId = admin._id;
        req.session.role = admin.role;
        res.redirect('/admin/dashboard');
    } else {
        res.render('admin/login', { error: 'Invalid Credentials!' });
    }
});

// Dashboard Admin
router.get('/dashboard', isAdmin, async (req, res) => {
    const admin = await Admin.findById(req.session.adminId);
    const projects = await Project.find({ authorId: admin._id }).sort({ createdAt: -1 });
    res.render('admin/dashboard', { admin, projects });
});

// Logout
router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
