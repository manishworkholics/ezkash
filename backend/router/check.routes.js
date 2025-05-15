const express = require('express');
const router = express.Router();
const checkController = require('../controllers/checkdetail.controller');

router.post('/add-check', checkController.addCheckDetail);
router.get('/get-all-check', checkController.getAllChecks);
router.get('/get-checkById/:id', checkController.getCheckById);
router.put('/update-check/:id', checkController.updateCheckById);
router.delete('/delete-check/:id', checkController.deleteCheckById);
router.get('/get-checkByVenderId/:venderId', checkController.getCheckByVenderId);
router.get('/get-checkByCompany/:company', checkController.getCheckByCompany);
router.get('/statuss', checkController.getCheckStatuss);
router.get('/status', checkController.getCheckStatus);

module.exports = router;
