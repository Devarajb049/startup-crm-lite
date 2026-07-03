import Lead from '../models/Lead.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * @desc    Get all leads for logged-in user
 * @route   GET /api/leads
 * @access  Private
 */
export const getLeads = async (req, res, next) => {
  try {
    const { search, status } = req.query;
    let query = { user: req.user.id };

    // Apply status filter if provided
    if (status) {
      query.status = status;
    }

    // Apply text search if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const leads = await Lead.find(query).sort({ createdAt: -1 });
    return successResponse(res, 'Leads retrieved successfully', leads);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get a single lead by ID
 * @route   GET /api/leads/:id
 * @access  Private
 */
export const getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, user: req.user.id });

    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, 'Lead retrieved successfully', lead);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new lead
 * @route   POST /api/leads
 * @access  Private
 */
export const createLead = async (req, res, next) => {
  const { name, company, email, phone, value, status, source } = req.body;

  try {
    const leadData = {
      user: req.user.id,
      name,
      company,
      email,
      phone,
      value,
      status,
      source
    };

    // Set transition timestamps based on initial status
    const now = new Date();
    if (status === 'Won') leadData.wonAt = now;
    if (status === 'Lost') leadData.lostAt = now;
    if (status === 'Meeting Scheduled') leadData.meetingAt = now;
    if (status === 'Proposal Sent') leadData.proposalAt = now;
    if (status === 'Contacted') leadData.contactedAt = now;

    const lead = await Lead.create(leadData);
    return successResponse(res, 'Lead created successfully', lead, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update a lead
 * @route   PUT /api/leads/:id
 * @access  Private
 */
export const updateLead = async (req, res, next) => {
  const { name, company, email, phone, value, status, source } = req.body;

  try {
    let lead = await Lead.findOne({ _id: req.params.id, user: req.user.id });

    if (!lead) {
      return errorResponse(res, 'Lead not found or unauthorized', 404);
    }

    // Capture changes & handle transition timestamps if status changes
    if (status && status !== lead.status) {
      const now = new Date();
      if (status === 'Won') lead.wonAt = now;
      if (status === 'Lost') lead.lostAt = now;
      if (status === 'Meeting Scheduled') lead.meetingAt = now;
      if (status === 'Proposal Sent') lead.proposalAt = now;
      if (status === 'Contacted') lead.contactedAt = now;
    }

    // Apply updates
    lead.name = name !== undefined ? name : lead.name;
    lead.company = company !== undefined ? company : lead.company;
    lead.email = email !== undefined ? email : lead.email;
    lead.phone = phone !== undefined ? phone : lead.phone;
    lead.value = value !== undefined ? value : lead.value;
    lead.status = status !== undefined ? status : lead.status;
    lead.source = source !== undefined ? source : lead.source;

    const updatedLead = await lead.save();
    return successResponse(res, 'Lead updated successfully', updatedLead);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a lead
 * @route   DELETE /api/leads/:id
 * @access  Private
 */
export const deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findOne({ _id: req.params.id, user: req.user.id });

    if (!lead) {
      return errorResponse(res, 'Lead not found or unauthorized', 404);
    }

    await lead.deleteOne();
    return successResponse(res, 'Lead deleted successfully', { id: req.params.id });
  } catch (error) {
    next(error);
  }
};
