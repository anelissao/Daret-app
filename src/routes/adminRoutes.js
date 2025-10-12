const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth');

// All routes require admin authentication
router.use(authenticate, authorize('Admin'));

router.get('/groups', adminController.getAllGroups);
router.get('/users', adminController.getAllUsers);
router.get('/kyc/pending', adminController.getPendingKYC);
router.put('/kyc/:userId/verify', adminController.verifyKYC);
router.get('/tickets', adminController.getAllTickets);
router.get('/stats', adminController.getStats);

module.exports = router;
