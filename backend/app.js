const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const routes = require('./router');
const { scanCheck } = require('./controllers/visionController');
const { scanLicense } = require('./controllers/visionController');
const { uploadImage } = require('./controllers/visionController');

const { scanChecks } = require('./controllers/scan.controller');
const { scanLicenses } = require('./controllers/scan.controller');
const { uploadImages } = require('./controllers/scan.controller');


require('dotenv').config();

require('./db/conn');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // handle JSON
app.use(express.urlencoded({ extended: true }));

app.use('/upload', express.static(path.join(__dirname, 'upload')));



app.use('/api/v1', routes);

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
app.post('/api/v1/scan-check', upload.single('image'), scanCheck);
app.post('/api/v1/scan-license', upload.single('image'), scanLicense);
app.post('/api/v1/upload-image', upload.single('image'), uploadImage);

app.post('/api/v1/scan-checks', upload.single('image'), scanChecks);
app.post('/api/v1/scan-licenses', upload.single('image'), scanLicenses);
app.post('/api/v1/upload-images', upload.single('image'), uploadImages);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
