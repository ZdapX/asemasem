const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    language: {
        type: String,
        required: true, // Contoh: Javascript, Python, PHP
        trim: true
    },
    type: {
        type: String,
        enum: ['CODE', 'FILE'],
        required: true
    },
    content: {
        type: String, // Berisi raw code jika tipe CODE, atau URL file jika tipe FILE
        required: true
    },
    notes: {
        type: String,
        default: ""
    },
    previewUrl: {
        type: String, // URL Gambar preview dari Cloudinary
        default: ""
    },
    likes: {
        type: Number,
        default: 0
    },
    downloads: {
        type: Number,
        default: 0
    },
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
