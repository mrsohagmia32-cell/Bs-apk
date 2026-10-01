const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Render-এর এনভায়রনমেন্ট ভেরিয়েবল থেকে MongoDB ইউআরএল রিড করবে
const MONGO_URI = process.env.MONGO_URI || "আপনার_লোকাল_ইউআরএল_বা_ফলব্যাক";

mongoose.connect(MONGO_URI)
    .then(() => console.log("MongoDB Connected Successfully!"))
    .catch(err => console.log("DB Connection Error: ", err));

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

app.post('/api/add-app', async (req, res) => {
    try {
        const newApp = new AppModel(req.body);
        await newApp.save();
        res.status(201).json({ success: true, message: "App added successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

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
