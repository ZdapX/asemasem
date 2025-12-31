
const express = require('express');
const path = require('path');
const session = require('express-session');
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

// --- CONFIGURATION ---
const app = express();

// MongoDB URI (Hardcoded as requested)
const mongoURI = "mongodb+srv://dafanation1313_db_user:hAMuQVA4A1QjeUWo@cluster0.d28log3.mongodb.net/sourceCodeHub?appName=Cluster0";

// Cloudinary Config (Hardcoded as requested)
cloudinary.config({
    cloud_name: 'dnb0q2s2h',
    api_key: '838368993294916',
    api_secret: 'N9U1eFJGKjJ-A8Eo4BTtSCl720c'
});

// Database Connection
mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("🚀 Cyber-Database Connected: MongoDB Atlas"))
  .catch(err => console.error("❌ Connection Failed:", err));

// --- MODELS (Inline to ensure availability) ---
const Admin = require('./models/Admin');

// --- MIDDLEWARE ---
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Session Management
app.use(session({
    secret: 'source-code-hub-ultra-secret-key-2025',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 Hours
}));

// Global Middleware for Admin Session
app.use((req, res, next) => {
    res.locals.adminSession = req.session.adminId || null;
    res.locals.adminRole = req.session.role || null;
    next();
});

// --- AUTO-SEEDING SYSTEM ---
// Membuat akun Admin & Owner secara otomatis jika belum ada di database
const seedAdmins = async () => {
    try {
        const count = await Admin.countDocuments();
        if (count === 0) {
            const initialAdmins = [
                {
                    username: 'Silverhold',
                    password: 'Rian',
                    name: 'SilverHold Official',
                    role: 'Admin',
                    quote: 'Jangan lupa sholat walaupun kamu seorang pendosa, Allah lebih suka orang pendosa yang sering bertaubat daripada orang yang merasa suci',
                    hashtags: ['bismillahcalonustad'],
                    photoUrl: 'https://res.cloudinary.com/dnb0q2s2h/image/upload/v1/default_avatar.png'
                },
                {
                    username: 'BraynOfficial',
                    password: 'Plerr321',
                    name: 'Brayn Official',
                    role: 'Owner',
                    quote: 'Tidak Semua Orang Suka Kita Berkembang Pesat!',
                    hashtags: ['backenddev', 'frontenddev', 'BraynOfficial'],
                    photoUrl: 'https://res.cloudinary.com/dnb0q2s2h/image/upload/v1/default_avatar.png'
                }
            ];
            await Admin.insertMany(initialAdmins);
            console.log("✅ Identity Verified: Default Admin & Owner created.");
        }
    } catch (err) {
        console.error("❌ Seeding Error:", err);
    }
};
seedAdmins();

// --- ROUTES ---
const indexRoutes = require('./routes/index');
const adminRoutes = require('./routes/admin');
const projectRoutes = require('./routes/project'); // Logic khusus upload & delete

app.use('/', indexRoutes);
app.use('/admin', adminRoutes);
app.use('/api/projects', projectRoutes);

// Error 404 Handler (Futuristic UI)
app.use((req, res) => {
    res.status(404).render('404');
});

// --- SERVER START ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
    ===========================================
    📡 SOURCE CODE HUB ENGINE IS READY
    🌐 PORT: ${PORT}
    🛡️ STATUS: PRODUCTION READY
    ===========================================
    `);
});

module.exports = app; // Required for Vercel
