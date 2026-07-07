import Lead from '../models/Lead.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

/**
 * @desc    Get all leads for the authenticated user with filtering, sorting, and pagination
 * @route   GET /api/leads
 * @access  Private
 * @input   req.query: { status, search, source, dateFrom, dateTo, page = 1, limit = 20, sortBy = 'createdAt', sortOrder = 'desc' }
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
      source,
      dateFrom,
      dateTo,
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

    // Apply source filter if provided and is not 'All'
    if (source && source !== 'All') {
      filter.source = source;
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

    // Apply date range filter on createdAt
    if (dateFrom || dateTo) {
      filter.createdAt = {};
      if (dateFrom) {
        filter.createdAt.$gte = new Date(dateFrom);
      }
      if (dateTo) {
        filter.createdAt.$lte = new Date(dateTo);
      }
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

    const totalPages = Math.ceil(total / limitNum);

    return res.status(200).json({
      success: true,
      data: leads,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: totalPages,
        hasNext: pageNum < totalPages,
        hasPrev: pageNum > 1,
      },
    });
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
      status: status || 'New',
      source: source || 'Website',
      value: value || 0,
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
 * @route   GET /api/leads/stats/summary
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

    const now = new Date();
    const startOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

    // Run match and conditional facets in a single database aggregation query
    const statsResult = await Lead.aggregate([
      { $match: { owner: req.user._id } },
      {
        $facet: {
          summary: [
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
                thisMonthLeads: {
                  $sum: {
                    $cond: [
                      { $gte: ['$createdAt', startOfThisMonth] },
                      1,
                      0,
                    ],
                  },
                },
                lastMonthLeads: {
                  $sum: {
                    $cond: [
                      {
                        $and: [
                          { $gte: ['$createdAt', startOfLastMonth] },
                          { $lte: ['$createdAt', endOfLastMonth] },
                        ],
                      },
                      1,
                      0,
                    ],
                  },
                },
              },
            },
          ],
          statusBreakdown: [
            { $group: { _id: '$status', count: { $sum: 1 } } },
          ],
          sourceBreakdown: [
            { $group: { _id: '$source', count: { $sum: 1 } } },
          ],
        },
      },
    ]);

    const summary = statsResult[0]?.summary[0] || {
      totalLeads: 0,
      wonLeads: 0,
      lostLeads: 0,
      pipelineValue: 0,
      wonRevenue: 0,
      thisMonthLeads: 0,
      lastMonthLeads: 0,
    };

    const totalLeads = summary.totalLeads;
    const won = summary.wonLeads;
    const lost = summary.lostLeads;
    const pipelineValue = summary.pipelineValue;
    const wonRevenue = summary.wonRevenue;
    const thisMonthLeads = summary.thisMonthLeads;
    const lastMonthLeads = summary.lastMonthLeads;

    // Calculate conversionRate & lostRate: (won / total) * 100, rounded to 1 decimal
    const conversionRate = totalLeads > 0 ? parseFloat(((won / totalLeads) * 100).toFixed(1)) : 0;
    const lostRate = totalLeads > 0 ? Math.round((lost / totalLeads) * 100) : 0;

    // Calculate growthRate: ((thisMonth - lastMonth) / lastMonth) * 100, safe division
    let growthRate = 0;
    if (lastMonthLeads > 0) {
      growthRate = parseFloat((((thisMonthLeads - lastMonthLeads) / lastMonthLeads) * 100).toFixed(1));
    } else if (thisMonthLeads > 0) {
      growthRate = 100;
    }

    // Convert statusBreakdown array to object
    const statusBreakdown = {
      New: 0,
      Contacted: 0,
      Qualified: 0,
      'Meeting Scheduled': 0,
      'Proposal Sent': 0,
      Negotiation: 0,
      Won: 0,
      Lost: 0,
    };
    statsResult[0]?.statusBreakdown.forEach((item) => {
      if (item._id && item._id in statusBreakdown) {
        statusBreakdown[item._id] = item.count;
      }
    });

    // Convert sourceBreakdown array to object
    const sourceBreakdown = {
      Website: 0,
      Referral: 0,
      LinkedIn: 0,
      'Cold Call': 0,
      'Email Campaign': 0,
      Facebook: 0,
      Instagram: 0,
      'Google Ads': 0,
      Other: 0,
    };
    statsResult[0]?.sourceBreakdown.forEach((item) => {
      if (item._id && item._id in sourceBreakdown) {
        sourceBreakdown[item._id] = item.count;
      }
    });

    const finalStats = {
      totalLeads,
      wonLeads: won,
      lostLeads: lost,
      conversionRate,
      lostRate,
      pipelineValue,
      wonRevenue,
      averageSalesCycle: 0, // Placeholder to prevent breaking any component UI expectations
      thisMonthLeads,
      lastMonthLeads,
      growthRate,
      statusBreakdown,
      sourceBreakdown,
    };

    return successResponse(res, finalStats, 'Lead stats retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Aggregate leads grouped by month for the last 6 months for trend charts
 * @route   GET /api/leads/stats/monthly
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
          lost: { $sum: { $cond: [{ $eq: ['$status', 'Lost'] }, 1, 0] } },
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
        lost: 0,
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
        match.lost = stat.lost || 0;
      }
    });

    const finalChartData = chronologicalMonths.map((m) => {
      const total = m.total;
      const won = m.won;
      const lost = m.lost;
      const conversionRate = total > 0 ? parseFloat(((won / total) * 100).toFixed(1)) : 0.0;
      return {
        month: `${m.name} ${m.year}`,
        total,
        won,
        lost,
        conversionRate,
      };
    });

    return successResponse(res, finalChartData, 'Monthly stats retrieved successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Quick search for autocomplete (React SearchBar debounce)
 * @route   GET /api/leads/search
 * @access  Private
 * @input   req.query: { q, limit = 5 }
 * @output  JSON success response containing matching lead documents (limited to 5) with only _id, name, company, email, status
 * @sideEffect None
 */
export const searchLeads = async (req, res, next) => {
  try {
    const { q, limit = 5 } = req.query;
    if (!q) {
      return successResponse(res, [], 'Search query is required');
    }

    const searchRegex = new RegExp(q, 'i');
    const filter = {
      owner: req.user._id,
      $or: [
        { name: searchRegex },
        { company: searchRegex },
        { email: searchRegex },
      ],
    };

    const limitNum = parseInt(limit, 10) || 5;

    const leads = await Lead.find(filter)
      .select('_id name company email status')
      .limit(limitNum);

    return successResponse(res, leads, 'Search completed successfully');
  } catch (error) {
    next(error);
  }
};
