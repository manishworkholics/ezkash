const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const bcrypt = require('bcrypt');
const routes = require('./router');


const { scanCheck } = require('./controllers/scan.controller');
const { scanLicense } = require('./controllers/scan.controller');
const { uploadImage } = require('./controllers/scan.controller');


require('dotenv').config();

require('./db/conn');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' })); // handle JSON
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use('/upload', express.static(path.join(__dirname, 'upload')));



app.use('/api/v1', routes);

// Multer setup for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Routes
app.post('/api/v1/scan-check', upload.single('image'), scanCheck);
app.post('/api/v1/scan-license', upload.single('image'), scanLicense);
app.post('/api/v1/upload-image', upload.single('image'), uploadImage);


// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
