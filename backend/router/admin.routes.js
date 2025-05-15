const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller');

router.post('/register', adminController.adminRegister);
router.post('/login', adminController.adminLogin);
router.get('/dashboard-detail', adminController.dashboardDetail);

router.post('/add-user', adminController.addUser);
router.get('/get-all-users', adminController.getAllUsers);
router.get('/get-all-users-byId/:id', adminController.getAllUsersById);
router.put('/update-users/:id', adminController.updateUser);
router.delete('/delete-users/:id', adminController.deleteUser);


router.get('/get-all-checks', adminController.getAllChecks);
router.get('/get-all-checks-byId/:id', adminController.getAllChecksById);
router.put('/update-checks/:id', adminController.updateCheck);
router.delete('/delete-checks/:id', adminController.deleteCheck);

router.get('/tickets/get-all-tickets', adminController.getAllTickets);
router.get('/tickets/get-ticketsById/:id', adminController.getTicketById);

module.exports = router;
