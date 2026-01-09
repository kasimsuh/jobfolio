const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  getResumeVersions,
  getResumeVersion,
  createResumeVersion,
  updateResumeVersion,
  deleteResumeVersion,
  compareVersions,
  duplicateVersion,
} = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

// All routes require authentication
router.use(protect);

// Validation rules
const resumeValidation = [
  body('name').trim().notEmpty().withMessage('Resume name is required'),
  body('content').trim().notEmpty().withMessage('Resume content is required'),
];

// Routes
router.route('/')
  .get(getResumeVersions)
  .post(resumeValidation, createResumeVersion);

// Compare two versions (must be before /:id route)
router.get('/compare/:id1/:id2', compareVersions);

router.route('/:id')
  .get(getResumeVersion)
  .put(updateResumeVersion)
  .delete(deleteResumeVersion);

router.post('/:id/duplicate', duplicateVersion);

module.exports = router;
