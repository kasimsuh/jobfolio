const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      maxlength: [100, 'Company name cannot exceed 100 characters'],
    },
    position: {
      type: String,
      required: [true, 'Position is required'],
      trim: true,
      maxlength: [150, 'Position cannot exceed 150 characters'],
    },
    location: {
      type: String,
      trim: true,
      maxlength: [100, 'Location cannot exceed 100 characters'],
    },
    status: {
      type: String,
      enum: ['saved', 'applied', 'interview', 'offer', 'rejected'],
      default: 'saved',
      index: true,
    },
    appliedDate: {
      type: Date,
      default: null,
    },
    deadline: {
      type: Date,
      default: null,
    },
    salary: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      enum: [
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
      ],
      default: '',
    },
    url: {
      type: String,
      trim: true,
    },
    notes: {
      type: String,
      maxlength: [2000, 'Notes cannot exceed 2000 characters'],
    },
    resumeVersion: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ResumeVersion',
      default: null,
    },
    contactName: {
      type: String,
      trim: true,
    },
    contactEmail: {
      type: String,
      trim: true,
    },
    interviewDates: [
      {
        date: Date,
        type: {
          type: String,
          enum: ['phone', 'technical', 'behavioral', 'onsite', 'final', 'other'],
        },
        notes: String,
      },
    ],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying
applicationSchema.index({ user: 1, status: 1 });
applicationSchema.index({ user: 1, createdAt: -1 });

// Virtual for checking if deadline is approaching
applicationSchema.virtual('isDeadlineApproaching').get(function () {
  if (!this.deadline) return false;
  const daysUntil = Math.ceil((this.deadline - new Date()) / (1000 * 60 * 60 * 24));
  return daysUntil >= 0 && daysUntil <= 7;
});

// Set toJSON to include virtuals
applicationSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Application', applicationSchema);
