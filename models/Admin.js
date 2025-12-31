const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['Admin', 'Owner'],
        default: 'Admin'
    },
    quote: {
        type: String,
        default: ""
    },
    hashtags: [{
        type: String
    }],
    photoUrl: {
        type: String,
        default: "https://res.cloudinary.com/dnb0q2s2h/image/upload/v1/default_avatar.png"
    }
}, { timestamps: true });

module.exports = mongoose.model('Admin', AdminSchema);
