const Application = require('../models/Application');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get all applications for current user
// @route   GET /api/applications
// @access  Private
const getApplications = asyncHandler(async (req, res) => {
  const { status, search, sort, limit = 100, page = 1 } = req.query;
  
  // Build query
  const query = { user: req.user._id };
  
  // Filter by status
  if (status && status !== 'all') {
    query.status = status;
  }
  
  // Search by company or position
  if (search) {
    query.$or = [
      { company: { $regex: search, $options: 'i' } },
      { position: { $regex: search, $options: 'i' } },
      { location: { $regex: search, $options: 'i' } },
    ];
  }
  
  // Sort options
  let sortOption = { updatedAt: -1 }; // Default: most recently updated
  if (sort === 'company') sortOption = { company: 1 };
  if (sort === 'deadline') sortOption = { deadline: 1 };
  if (sort === 'appliedDate') sortOption = { appliedDate: -1 };
  if (sort === 'createdAt') sortOption = { createdAt: -1 };
  
  // Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const applications = await Application.find(query)
    .populate('resumeVersion', 'name versionNumber')
    .sort(sortOption)
    .limit(parseInt(limit))
    .skip(skip);
  
  const total = await Application.countDocuments(query);
  
  res.json({
    success: true,
    count: applications.length,
    total,
    page: parseInt(page),
    pages: Math.ceil(total / parseInt(limit)),
    data: applications,
  });
});

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
const getApplication = asyncHandler(async (req, res) => {
  const application = await Application.findOne({
    _id: req.params.id,
    user: req.user._id,
  }).populate('resumeVersion', 'name versionNumber content');
  
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }
  
  res.json({
    success: true,
    data: application,
  });
});

// @desc    Create new application
// @route   POST /api/applications
// @access  Private
const createApplication = asyncHandler(async (req, res) => {
  // Add user to request body
  req.body.user = req.user._id;
  
  // If status is not 'saved', set appliedDate if not provided
  if (req.body.status && req.body.status !== 'saved' && !req.body.appliedDate) {
    req.body.appliedDate = new Date();
  }
  
  const application = await Application.create(req.body);
  
  // Populate resume version info
  await application.populate('resumeVersion', 'name versionNumber');
  
  res.status(201).json({
    success: true,
    data: application,
  });
});

// @desc    Update application
// @route   PUT /api/applications/:id
// @access  Private
const updateApplication = asyncHandler(async (req, res) => {
  let application = await Application.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }
  
  // If changing status from 'saved' to something else, set appliedDate
  if (
    application.status === 'saved' &&
    req.body.status &&
    req.body.status !== 'saved' &&
    !req.body.appliedDate &&
    !application.appliedDate
  ) {
    req.body.appliedDate = new Date();
  }
  
  application = await Application.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('resumeVersion', 'name versionNumber');
  
  res.json({
    success: true,
    data: application,
  });
});

// @desc    Delete application
// @route   DELETE /api/applications/:id
// @access  Private
const deleteApplication = asyncHandler(async (req, res) => {
  const application = await Application.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }
  
  await application.deleteOne();
  
  res.json({
    success: true,
    data: {},
  });
});

// @desc    Get application statistics
// @route   GET /api/applications/stats
// @access  Private
const getApplicationStats = asyncHandler(async (req, res) => {
  const stats = await Application.aggregate([
    { $match: { user: req.user._id } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);
  
  // Transform to object
  const statusCounts = {
    saved: 0,
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
  };
  
  stats.forEach((stat) => {
    statusCounts[stat._id] = stat.count;
  });
  
  const total = Object.values(statusCounts).reduce((a, b) => a + b, 0);
  const applied = total - statusCounts.saved;
  const responded = statusCounts.interview + statusCounts.offer + statusCounts.rejected;
  
  res.json({
    success: true,
    data: {
      total,
      byStatus: statusCounts,
      applied,
      responseRate: applied > 0 ? ((responded / applied) * 100).toFixed(1) : 0,
      interviewRate:
        applied > 0
          ? (((statusCounts.interview + statusCounts.offer) / applied) * 100).toFixed(1)
          : 0,
      offerRate:
        statusCounts.interview + statusCounts.offer > 0
          ? ((statusCounts.offer / (statusCounts.interview + statusCounts.offer)) * 100).toFixed(1)
          : 0,
    },
  });
});

// @desc    Bulk update application status
// @route   PUT /api/applications/bulk-status
// @access  Private
const bulkUpdateStatus = asyncHandler(async (req, res) => {
  const { ids, status } = req.body;
  
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    res.status(400);
    throw new Error('Please provide application IDs');
  }
  
  if (!status) {
    res.status(400);
    throw new Error('Please provide a status');
  }
  
  const result = await Application.updateMany(
    { _id: { $in: ids }, user: req.user._id },
    { status, updatedAt: new Date() }
  );
  
  res.json({
    success: true,
    data: {
      modifiedCount: result.modifiedCount,
    },
  });
});

module.exports = {
  getApplications,
  getApplication,
  createApplication,
  updateApplication,
  deleteApplication,
  getApplicationStats,
  bulkUpdateStatus,
};
