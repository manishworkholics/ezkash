const express = require('express');
const router = express.Router();

router.use('/admin', require('./admin.routes'));
router.use('/auth', require('./auth.routes'));
router.use('/check', require('./check.routes'));
router.use('/complain', require('./ticket.routes'));



module.exports = router;