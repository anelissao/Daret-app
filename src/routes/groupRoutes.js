const express = require('express');
const router = express.Router();
const groupController = require('../controllers/groupController');
const { authenticate, requireKYC } = require('../middleware/auth');
const validate = require('../middleware/validation');
const { createGroupSchema, updateGroupSchema } = require('../validators/groupValidator');

// All routes require authentication
router.use(authenticate);

router.post('/', requireKYC, validate(createGroupSchema), groupController.createGroup);
router.get('/', groupController.getGroups);
router.get('/:id', groupController.getGroupById);
router.post('/:id/join', requireKYC, groupController.joinGroup);
router.put('/:id', requireKYC, validate(updateGroupSchema), groupController.updateGroup);
router.post('/:id/start', requireKYC, groupController.startGroup);
router.get('/:id/history', groupController.getGroupHistory);

module.exports = router;
