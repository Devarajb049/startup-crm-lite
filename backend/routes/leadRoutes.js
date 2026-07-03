import express from 'express';
import { body } from 'express-validator';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead
} from '../controllers/leadController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Apply authorization guard to all routes in this router
router.use(protect);

// Lead validation rules
const leadValidation = [
  body('name').notEmpty().withMessage('Contact name is required').trim(),
  body('company').notEmpty().withMessage('Company name is required').trim(),
  body('email').isEmail().withMessage('Please enter a valid email address').normalizeEmail(),
  body('phone').optional().trim(),
  body('value').optional().isNumeric().withMessage('Estimated value must be a number'),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Meeting Scheduled', 'Proposal Sent', 'Won', 'Lost'])
    .withMessage('Invalid lead status'),
  body('source')
    .optional()
    .isIn(['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Other'])
    .withMessage('Invalid lead source')
];

// Routes
router.route('/')
  .get(getLeads)
  .post(leadValidation, validate, createLead);

router.route('/:id')
  .get(getLeadById)
  .put(leadValidation, validate, updateLead)
  .delete(deleteLead);

export default router;
