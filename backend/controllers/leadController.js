import Lead from '../models/Lead.js';
import { successResponse, errorResponse, paginatedResponse } from '../utils/apiResponse.js';

/**
 * @desc    Get all leads for the authenticated user with filtering, sorting, and pagination
 * @route   GET /api/leads
 * @access  Private
 * @input   req.query: { status, search, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' }
 * @output  JSON paginated response containing matching lead documents and pagination metadata
 * @sideEffect None
 */
export const getLeads = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[getLeads] Fetching leads for user: ${req.user._id}`);
    }

    const {
      status,
      search,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = req.query;

    // Filter initialized with owner isolation logic
    const filter = { owner: req.user._id };

    // Apply status filter if provided and is not 'All'
    if (status && status !== 'All') {
      filter.status = status;
    }

    // Apply regex search against contact name, company, or email
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      filter.$or = [
        { name: searchRegex },
        { company: searchRegex },
        { email: searchRegex },
      ];
    }

    // Parse pagination parameters
    const pageNum = parseInt(page, 10) || 1;
    const limitNum = parseInt(limit, 10) || 20;
    const skipNum = (pageNum - 1) * limitNum;

    // Configure sorting
    const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

    // Run query and document counter in parallel
    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort(sort)
        .skip(skipNum)
        .limit(limitNum),
      Lead.countDocuments(filter),
    ]);

    return paginatedResponse(res, leads, total, pageNum, limitNum);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create a new lead assigned to the authenticated user
 * @route   POST /api/leads
 * @access  Private
 * @input   req.body: { name, company, email, phone, status, source, value, notes }
 * @output  JSON success response with the newly created lead document
 * @sideEffect Inserts new lead record into the database
 */
export const createLead = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[createLead] Creating lead for user: ${req.user._id}`);
    }

    const { name, company, email, phone, status, source, value, notes } = req.body;

    // Build the new lead object with owner isolation
    const lead = await Lead.create({
      name,
      company,
      email,
      phone,
      status,
      source,
      value,
      notes,
      owner: req.user._id,
    });

    return successResponse(res, lead, 'Lead created successfully', 201);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Retrieve details of a specific lead by ID
 * @route   GET /api/leads/:id
 * @access  Private
 * @input   req.params.id: Lead ID
 * @output  JSON success response containing the found lead document
 * @sideEffect None
 */
export const getLeadById = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[getLeadById] Fetching lead ${req.params.id} for user: ${req.user._id}`);
    }

    // Query filters by both lead ID and the owner ID to isolate records
    const lead = await Lead.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, lead, 'Lead retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update an existing lead's fields
 * @route   PUT /api/leads/:id
 * @access  Private
 * @input   req.params.id: Lead ID, req.body: field updates (excluding owner)
 * @output  JSON success response containing the updated lead document
 * @sideEffect Updates a lead record in the database
 */
export const updateLead = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[updateLead] Updating lead ${req.params.id} for user: ${req.user._id}`);
    }

    const updateData = { ...req.body };

    // Prevent changing the lead's owner
    delete updateData.owner;

    // Find and update lead matching ID and owner, executing validations on the updates
    const updatedLead = await Lead.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, updatedLead, 'Lead updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update only the status of a specific lead
 * @route   PATCH /api/leads/:id/status
 * @access  Private
 * @input   req.params.id: Lead ID, req.body: { status }
 * @output  JSON success response containing the updated lead document
 * @sideEffect Updates a lead's status in the database
 */
export const updateLeadStatus = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[updateLeadStatus] Updating status of lead ${req.params.id} for user: ${req.user._id}`);
    }

    const { status } = req.body;

    // Find and update in a single operation
    const updatedLead = await Lead.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      { status },
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    return successResponse(res, updatedLead, 'Lead status updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a lead from the CRM
 * @route   DELETE /api/leads/:id
 * @access  Private
 * @input   req.params.id: Lead ID
 * @output  JSON success response with delete confirmation payload
 * @sideEffect Deletes a lead record from the database
 */
export const deleteLead = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[deleteLead] Deleting lead ${req.params.id} for user: ${req.user._id}`);
    }

    const lead = await Lead.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!lead) {
      return errorResponse(res, 'Lead not found', 404);
    }

    // Call document delete to trigger any pre-delete Mongoose middleware if needed
    await lead.deleteOne();

    return successResponse(res, { id: req.params.id }, 'Lead deleted successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Calculate aggregate KPIs and status counts for the user's dashboard cards
 * @route   GET /api/leads/stats
 * @access  Private
 * @input   None
 * @output  JSON success response containing KPI metrics and status distribution counts
 * @sideEffect None
 */
export const getLeadStats = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[getLeadStats] Aggregating dashboard stats for user: ${req.user._id}`);
    }

    // Run match and conditional sums on status stages
    const statsResult = await Lead.aggregate([
      { $match: { owner: req.user._id } },
      {
        $group: {
          _id: null,
          totalLeads: { $sum: 1 },
          wonLeads: { $sum: { $cond: [{ $eq: ['$status', 'Won'] }, 1, 0] } },
          lostLeads: { $sum: { $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0] } },
          pipelineValue: {
            $sum: {
              $cond: [
                { $and: [{ $ne: ['$status', 'Won'] }, { $ne: ['$status', 'Lost'] }] },
                { $ifNull: ['$value', 0] },
                0,
              ],
            },
          },
          wonRevenue: {
            $sum: {
              $cond: [
                { $eq: ['$status', 'Won'] },
                { $ifNull: ['$value', 0] },
                0,
              ],
            },
          },
          stageNew: { $sum: { $cond: [{ $eq: ['$status', 'New'] }, 1, 0] } },
          stageContacted: { $sum: { $cond: [{ $eq: ['$status', 'Contacted'] }, 1, 0] } },
          stageMeeting: { $sum: { $cond: [{ $eq: ['$status', 'Meeting Scheduled'] }, 1, 0] } },
          stageProposal: { $sum: { $cond: [{ $eq: ['$status', 'Proposal Sent'] }, 1, 0] } },
        },
      },
    ]);

    const finalStats = {
      totalLeads: 0,
      wonLeads: 0,
      lostLeads: 0,
      conversionRate: 0,
      lostRate: 0,
      pipelineValue: 0,
      wonRevenue: 0,
      averageSalesCycle: 0,
      statusBreakdown: {
        New: 0,
        Contacted: 0,
        'Meeting Scheduled': 0,
        'Proposal Sent': 0,
        Won: 0,
        Lost: 0,
      },
    };

    if (statsResult && statsResult.length > 0) {
      const r = statsResult[0];
      const total = r.totalLeads || 0;
      const won = r.wonLeads || 0;
      const lost = r.lostLeads || 0;

      finalStats.totalLeads = total;
      finalStats.wonLeads = won;
      finalStats.lostLeads = lost;
      finalStats.conversionRate = total > 0 ? Math.round((won / total) * 100) : 0;
      finalStats.lostRate = total > 0 ? Math.round((lost / total) * 100) : 0;
      finalStats.pipelineValue = r.pipelineValue || 0;
      finalStats.wonRevenue = r.wonRevenue || 0;
      finalStats.statusBreakdown = {
        New: r.stageNew || 0,
        Contacted: r.stageContacted || 0,
        'Meeting Scheduled': r.stageMeeting || 0,
        'Proposal Sent': r.stageProposal || 0,
        Won: won,
        Lost: lost,
      };
    }

    return successResponse(res, finalStats, 'Lead stats retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Aggregate leads grouped by month for the last 6 months for trend charts
 * @route   GET /api/leads/monthly-stats
 * @access  Private
 * @input   None
 * @output  JSON success response with a chronologically ordered array of monthly counts
 * @sideEffect None
 */
export const getMonthlyStats = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[getMonthlyStats] Generating monthly analytics for user: ${req.user._id}`);
    }

    // Set timeline window boundary: start of the month 6 months ago
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    // Group leads in range by creation year and month
    const monthlyStats = await Lead.aggregate([
      {
        $match: {
          owner: req.user._id,
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          total: { $sum: 1 },
          won: { $sum: { $cond: [{ $eq: ['$status', 'Won'] }, 1, 0] } },
        },
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 },
      },
    ]);

    // Construct reference list of last 6 calendar months to guarantee zero-filled slots are plotted
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const chronologicalMonths = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      chronologicalMonths.push({
        year: d.getFullYear(),
        month: d.getMonth() + 1, // MongoDB uses 1-based months
        name: monthNames[d.getMonth()],
        total: 0,
        won: 0,
      });
    }

    // Map aggregation counts onto our reference list
    monthlyStats.forEach((stat) => {
      const match = chronologicalMonths.find(
        (m) => m.year === stat._id.year && m.month === stat._id.month
      );
      if (match) {
        match.total = stat.total;
        match.won = stat.won;
      }
    });

    const finalChartData = chronologicalMonths.map((m) => ({
      month: m.name,
      total: m.total,
      won: m.won,
    }));

    return successResponse(res, finalChartData, 'Monthly stats retrieved successfully');
  } catch (error) {
    next(error);
  }
};
