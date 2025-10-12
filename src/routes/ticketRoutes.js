const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketController');
const { authenticate } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

router.post('/', ticketController.createTicket);
router.get('/', ticketController.getUserTickets);
router.put('/:id', ticketController.updateTicket);
router.post('/:id/response', ticketController.addResponse);

module.exports = router;
