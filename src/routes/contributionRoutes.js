const express = require('express');
const router = express.Router();
const contributionController = require('../controllers/contributionController');
const { authenticate, requireKYC } = require('../middleware/auth');
const validate = require('../middleware/validation');
const { createContributionSchema } = require('../validators/contributionValidator');

// All routes require authentication and KYC
router.use(authenticate, requireKYC);

router.post('/', validate(createContributionSchema), contributionController.recordContribution);
router.get('/group/:groupId', contributionController.getGroupContributions);
router.get('/my-contributions', contributionController.getUserContributions);

module.exports = router;
