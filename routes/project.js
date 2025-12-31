const express = require('express');
const router = express.Router();
const multer = require('multer');
const { cloudinary } = require('../config/db');
const Project = require('../models/Project');

// Konfigurasi Multer (Memory Storage)
const storage = multer.memoryStorage();
const upload = multer.single('fileUpload');

// Middleware Proteksi
const isAdmin = (req, res, next) => {
    if (req.session.adminId) return next();
    res.status(401).json({ message: "Unauthorized" });
};

// POST: Create New Project
router.post('/upload', isAdmin, upload, async (req, res) => {
    try {
        const { name, language, type, content, notes, previewUrlExternal } = req.body;
        let finalContent = content;
        let finalPreview = previewUrlExternal;

        // Jika ada file yang diupload (untuk tipe FILE atau Gambar Preview)
        if (req.file) {
            // Logika upload ke Cloudinary menggunakan buffer
            const uploadPromise = new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream({ resource_type: 'auto' }, (error, result) => {
                    if (error) reject(error);
                    else resolve(result);
                });
                stream.end(req.file.buffer);
            });
            const result = await uploadPromise;
            
            if (type === 'FILE') finalContent = result.secure_url;
            // Gunakan file sebagai preview jika tidak ada URL external
            if (!finalPreview) finalPreview = result.secure_url;
        }

        const newProject = new Project({
            name,
            language,
            type,
            content: finalContent,
            notes,
            previewUrl: finalPreview,
            authorId: req.session.adminId
        });

        await newProject.save();
        res.redirect('/admin/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).send("Gagal mengupload proyek.");
    }
});

// DELETE: Hapus Proyek
router.post('/delete/:id', isAdmin, async (req, res) => {
    await Project.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard');
});

module.exports = router;
