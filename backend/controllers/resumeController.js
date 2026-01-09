const ResumeVersion = require('../models/ResumeVersion');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get all resume versions for current user
// @route   GET /api/resumes
// @access  Private
const getResumeVersions = asyncHandler(async (req, res) => {
  const resumes = await ResumeVersion.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  
  res.json({
    success: true,
    count: resumes.length,
    data: resumes,
  });
});

// @desc    Get single resume version
// @route   GET /api/resumes/:id
// @access  Private
const getResumeVersion = asyncHandler(async (req, res) => {
  const resume = await ResumeVersion.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  
  if (!resume) {
    res.status(404);
    throw new Error('Resume version not found');
  }
  
  res.json({
    success: true,
    data: resume,
  });
});

// @desc    Create new resume version
// @route   POST /api/resumes
// @access  Private
const createResumeVersion = asyncHandler(async (req, res) => {
  req.body.user = req.user._id;
  
  const resume = await ResumeVersion.create(req.body);
  
  res.status(201).json({
    success: true,
    data: resume,
  });
});

// @desc    Update resume version
// @route   PUT /api/resumes/:id
// @access  Private
const updateResumeVersion = asyncHandler(async (req, res) => {
  let resume = await ResumeVersion.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  
  if (!resume) {
    res.status(404);
    throw new Error('Resume version not found');
  }
  
  // Don't allow changing user
  delete req.body.user;
  
  resume = await ResumeVersion.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  
  res.json({
    success: true,
    data: resume,
  });
});

// @desc    Delete resume version
// @route   DELETE /api/resumes/:id
// @access  Private
const deleteResumeVersion = asyncHandler(async (req, res) => {
  const resume = await ResumeVersion.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  
  if (!resume) {
    res.status(404);
    throw new Error('Resume version not found');
  }
  
  await resume.deleteOne();
  
  res.json({
    success: true,
    data: {},
  });
});

// @desc    Compare two resume versions (diff)
// @route   GET /api/resumes/compare/:id1/:id2
// @access  Private
const compareVersions = asyncHandler(async (req, res) => {
  const { id1, id2 } = req.params;
  
  const [resume1, resume2] = await Promise.all([
    ResumeVersion.findOne({ _id: id1, user: req.user._id }),
    ResumeVersion.findOne({ _id: id2, user: req.user._id }),
  ]);
  
  if (!resume1 || !resume2) {
    res.status(404);
    throw new Error('One or both resume versions not found');
  }
  
  // Compute diff
  const diff = computeDiff(resume1.content, resume2.content);
  
  // Calculate stats
  const stats = {
    added: diff.filter((d) => d.type === 'added').length,
    removed: diff.filter((d) => d.type === 'removed').length,
    unchanged: diff.filter((d) => d.type === 'unchanged').length,
  };
  
  res.json({
    success: true,
    data: {
      version1: {
        id: resume1._id,
        name: resume1.name,
        versionNumber: resume1.versionNumber,
        lineCount: resume1.content.split('\n').length,
      },
      version2: {
        id: resume2._id,
        name: resume2.name,
        versionNumber: resume2.versionNumber,
        lineCount: resume2.content.split('\n').length,
      },
      diff,
      stats,
    },
  });
});

// @desc    Duplicate a resume version
// @route   POST /api/resumes/:id/duplicate
// @access  Private
const duplicateVersion = asyncHandler(async (req, res) => {
  const originalResume = await ResumeVersion.findOne({
    _id: req.params.id,
    user: req.user._id,
  });
  
  if (!originalResume) {
    res.status(404);
    throw new Error('Resume version not found');
  }
  
  const newResume = await ResumeVersion.create({
    user: req.user._id,
    name: `${originalResume.name} (Copy)`,
    description: originalResume.description,
    content: originalResume.content,
    tags: originalResume.tags,
  });
  
  res.status(201).json({
    success: true,
    data: newResume,
  });
});

// Helper function: Compute diff between two texts
function computeDiff(oldText, newText) {
  const oldLines = oldText.split('\n');
  const newLines = newText.split('\n');
  const result = [];
  
  // Simple LCS-based diff
  const lcs = computeLCS(oldLines, newLines);
  
  let oldIdx = 0;
  let newIdx = 0;
  let lcsIdx = 0;
  
  while (oldIdx < oldLines.length || newIdx < newLines.length) {
    if (
      lcsIdx < lcs.length &&
      oldIdx < oldLines.length &&
      oldLines[oldIdx] === lcs[lcsIdx]
    ) {
      if (newIdx < newLines.length && newLines[newIdx] === lcs[lcsIdx]) {
        result.push({
          type: 'unchanged',
          content: oldLines[oldIdx],
          oldLineNumber: oldIdx + 1,
          newLineNumber: newIdx + 1,
        });
        oldIdx++;
        newIdx++;
        lcsIdx++;
      } else {
        result.push({
          type: 'added',
          content: newLines[newIdx],
          newLineNumber: newIdx + 1,
        });
        newIdx++;
      }
    } else if (
      oldIdx < oldLines.length &&
      (lcsIdx >= lcs.length || oldLines[oldIdx] !== lcs[lcsIdx])
    ) {
      result.push({
        type: 'removed',
        content: oldLines[oldIdx],
        oldLineNumber: oldIdx + 1,
      });
      oldIdx++;
    } else if (newIdx < newLines.length) {
      result.push({
        type: 'added',
        content: newLines[newIdx],
        newLineNumber: newIdx + 1,
      });
      newIdx++;
    }
  }
  
  return result;
}

// Helper function: Compute Longest Common Subsequence
function computeLCS(arr1, arr2) {
  const m = arr1.length;
  const n = arr2.length;
  const dp = Array(m + 1)
    .fill(null)
    .map(() => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (arr1[i - 1] === arr2[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  // Backtrack to find LCS
  const lcs = [];
  let i = m,
    j = n;
  while (i > 0 && j > 0) {
    if (arr1[i - 1] === arr2[j - 1]) {
      lcs.unshift(arr1[i - 1]);
      i--;
      j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  
  return lcs;
}

module.exports = {
  getResumeVersions,
  getResumeVersion,
  createResumeVersion,
  updateResumeVersion,
  deleteResumeVersion,
  compareVersions,
  duplicateVersion,
};
