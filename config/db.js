
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;

// Hardcoded MongoDB URI sesuai permintaan
const mongoURI = "mongodb+srv://dafanation1313_db_user:hAMuQVA4A1QjeUWo@cluster0.d28log3.mongodb.net/sourceCodeHub?appName=Cluster0";

// Konfigurasi Cloudinary
cloudinary.config({
    cloud_name: 'dnb0q2s2h',
    api_key: '838368993294916',
    api_secret: 'N9U1eFJGKjJ-A8Eo4BTtSCl720c'
});

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("🚀 Cyber-Database Connected: MongoDB");
    } catch (err) {
        console.error("❌ Database Connection Failed:", err.message);
        process.exit(1);
    }
};

module.exports = { connectDB, cloudinary };
