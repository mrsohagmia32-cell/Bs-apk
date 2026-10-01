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
    downloadUrl: String,
    link: String,
    size: String,
    screenshots: [String]
});

const AppModel = mongoose.model('App', appSchema);

// নতুন অ্যাপ যোগ করার রাউট
app.post('/api/add-app', async (req, res) => {
    try {
        const newApp = new AppModel(req.body);
        await newApp.save();
        res.status(201).json({ success: true, message: "App added successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// সব অ্যাপ দেখার রাউট (এখানে ডাউনলোড লিংক নিশ্চিত করার জন্য ম্যাপ করা হয়েছে)
app.get('/api/apps', async (req, res) => {
    try {
        const apps = await AppModel.find();
        
        // প্রতিটি অ্যাপের জন্য ডাউনলোড লিংক নিশ্চিত করা হচ্ছে
        const formattedApps = apps.map(app => {
            const appObj = app.toObject();
            // downloadUrl বা link যেকোনো একটি থাকলেই সেটাকে প্রাধান্য দেওয়া হবে
            let finalLink = appObj.downloadUrl || appObj.link || '#';
            finalLink = finalLink.trim();
            
            if (finalLink !== '#' && !finalLink.startsWith('http://') && !finalLink.startsWith('https://')) {
                finalLink = 'https://' + finalLink;
            }
            
            appObj.downloadUrl = finalLink;
            return appObj;
        });

        res.json(formattedApps);
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// অ্যাপ আপডেট বা এডিট করার রাউট
app.put('/api/apps/:id', async (req, res) => {
    try {
        const updatedApp = await AppModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedApp) {
            return res.status(404).json({ success: false, message: "App not found" });
        }
        res.json({ success: true, message: "App updated successfully!", updatedApp });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// অ্যাপ ডিলিট করার রাউট
app.delete('/api/apps/:id', async (req, res) => {
    try {
        const deletedApp = await AppModel.findByIdAndDelete(req.params.id);
        if (!deletedApp) {
            return res.status(404).json({ success: false, message: "App not found" });
        }
        res.json({ success: true, message: "App deleted successfully!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
