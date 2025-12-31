
const express = require('express');
const path = require('path');
const session = require('express-session');
const { connectDB } = require('./config/db');
const Admin = require('./models/Admin');

const app = express();

// Koneksi Database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session Config (Hardcoded Secret)
app.use(session({
    secret: 'source-code-hub-cyberpunk-2025-secret',
    resave: false,
    saveUninitialized: false
}));

// Template Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// SEEDING ADMIN: Otomatis membuat akun jika DB kosong
const seedAdmins = async () => {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
        const initialAdmins = [
            {
                username: 'Silverhold',
                password: 'Rian',
                name: 'SilverHold Official',
                role: 'Admin',
                quote: 'Jangan lupa sholat walaupun kamu seorang pendosa, Allah lebih suka orang pendosa yang sering bertaubat daripada orang yang merasa suci',
                hashtags: ['bismillahcalonustad']
            },
            {
                username: 'BraynOfficial',
                password: 'Plerr321',
                name: 'Brayn Official',
                role: 'Owner',
                quote: 'Tidak Semua Orang Suka Kita Berkembang Pesat!',
                hashtags: ['backenddev', 'frontenddev', 'BraynOfficial']
            }
        ];
        await Admin.insertMany(initialAdmins);
        console.log("✅ Default Admins & Owner Initialized!");
    }
};
seedAdmins();

// Routes akan diimpor di batch berikutnya
// app.use('/', require('./routes/index'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
    🌐 SOURCE CODE HUB IS LIVE
    🚀 Port: ${PORT}
    🎨 Theme: Cyberpunk-Minimalist
    `);
});

module.exports = app;
