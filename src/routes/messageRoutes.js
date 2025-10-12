const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

router.post('/:groupId/messages', messageController.sendMessage);
router.get('/:groupId/messages', messageController.getMessages);
router.put('/messages/:messageId/read', messageController.markAsRead);

module.exports = router;
