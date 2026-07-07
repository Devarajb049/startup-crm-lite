import express from 'express';
import { body } from 'express-validator';
import {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  updateLeadStatus,
  deleteLead,
  getLeadStats,
  getMonthlyStats,
  searchLeads,
} from '../controllers/leadController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';

const router = express.Router();

// Apply protect middleware to ALL routes in this file
router.use(protect);

// Lead validation rules for creating/updating records
const leadValidation = [
  body('name')
    .notEmpty()
    .withMessage('Contact name is required')
    .isLength({ min: 2 })
    .withMessage('Contact name must be at least 2 characters long')
    .trim(),
  body('company')
    .notEmpty()
    .withMessage('Company name is required')
    .trim(),
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('status')
    .optional()
    .isIn(['New', 'Contacted', 'Qualified', 'Meeting Scheduled', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'])
    .withMessage('Invalid lead status'),
  body('source')
    .optional()
    .isIn(['Website', 'Referral', 'LinkedIn', 'Cold Call', 'Email Campaign', 'Facebook', 'Instagram', 'Google Ads', 'Other'])
    .withMessage('Invalid lead source'),
  body('value')
    .optional()
    .isNumeric()
    .withMessage('Estimated value must be a number'),
];

// Validation rules specifically for status modification
const statusUpdateValidation = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(['New', 'Contacted', 'Qualified', 'Meeting Scheduled', 'Proposal Sent', 'Negotiation', 'Won', 'Lost'])
    .withMessage('Invalid lead status'),
];

/* =========================================================================
   STATIC / AGGREGATION API ENDPOINTS
   (Must be registered BEFORE dynamic /:id endpoints to avoid parameter collision)
   ========================================================================= */

// 1. GET /api/leads/stats & /api/leads/stats/summary - Fetch pipeline stats (total counts, conversion rates, and revenue)
router.get('/stats', getLeadStats);
router.get('/stats/summary', getLeadStats);

// 2. GET /api/leads/monthly-stats & /api/leads/stats/monthly - Fetch monthly aggregation counts for the last 6 months
router.get('/monthly-stats', getMonthlyStats);
router.get('/stats/monthly', getMonthlyStats);

// 2.5 GET /api/leads/search - Search endpoint for autocomplete (must be before /:id)
router.get('/search', searchLeads);

/* =========================================================================
   COLLECTION API ENDPOINTS
   ========================================================================= */

// 3. GET /api/leads - Fetch all leads matching search/status query params
// 4. POST /api/leads - Create a new lead assigned to the logged-in user
router
  .route('/')
  .get(getLeads)
  .post(validate(leadValidation), createLead);

/* =========================================================================
   INDIVIDUAL RESOURCE API ENDPOINTS
   ========================================================================= */

// 5. GET /api/leads/:id - Retrieve details of a specific lead by ID
// 6. PUT /api/leads/:id - Update an existing lead record
// 7. DELETE /api/leads/:id - Remove a lead record from the CRM
router
  .route('/:id')
  .get(getLeadById)
  .put(validate(leadValidation), updateLead)
  .delete(deleteLead);

// 8. PATCH /api/leads/:id/status - Update only the status stage of a specific lead
router.patch('/:id/status', validate(statusUpdateValidation), updateLeadStatus);

export default router;
