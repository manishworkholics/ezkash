const multer = require('multer');
const storage = multer.memoryStorage(); // store in memory before writing
const upload = multer({ storage });
module.exports = upload;