const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// আপনার দেওয়া MongoDB Atlas কানেকশন স্ট্রিং (সাথে appstore ডাটাবেস নাম যুক্ত করা)
const MONGO_URI = "mongodb+srv://kinkbd71_db_user:YE7KJJq7BSclFFfA@cluster0.e6w2ulv.mongodb.net/appstore?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully!"))
    .catch(err => console.log("DB Connection Error: ", err));

// অ্যাপসের জন্য ডেটাবেস স্কিমা (Schema)
const appSchema = new mongoose.Schema({
    name: String,
    desc: String,
    fullDesc: String,
    icon: String,
    link: String,
    size: String,
    screenshots: [String]
});

const AppModel = mongoose.model('App', appSchema);

// নতুন অ্যাপ যোগ করার এপিআই
app.post('/api/add-app', async (req, res) => {
    try {
        const newApp = new AppModel(req.body);
        await newApp.save();
        res.status(201).json({ success: true, message: "App added successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// সব অ্যাপ দেখার এপিআই
app.get('/api/apps', async (req, res) => {
    try {
        const apps = await AppModel.find();
        res.json(apps);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
