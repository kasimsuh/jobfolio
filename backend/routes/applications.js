const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
  getApplicationStats,
  bulkUpdateStatus,
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Validation rules
const applicationValidation = [
  body('company').trim().notEmpty().withMessage('Company name is required'),
  body('position').trim().notEmpty().withMessage('Position is required'),
  body('status')
    .optional()
    .isIn(['saved', 'applied', 'interview', 'offer', 'rejected'])
    .withMessage('Invalid status'),
  body('source')
    .optional()
    .isIn([
      'LinkedIn',
      'Handshake',
      'Indeed',
      'Company Website',
      'WaterlooWorks',
      'Glassdoor',
      'Referral',
      'Career Fair',
      'Other',
      '',
    ])
    .withMessage('Invalid source'),
];

// Routes
router.route('/')
  .get(getApplications)
  .post(applicationValidation, createApplication);

router.get('/stats', getApplicationStats);
router.put('/bulk-status', bulkUpdateStatus);

router.route('/:id')
  .get(getApplication)
  .put(updateApplication)
  .delete(deleteApplication);

module.exports = router;
