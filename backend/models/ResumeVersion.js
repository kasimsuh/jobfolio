const mongoose = require('mongoose');

const resumeVersionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, 'Resume version name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    content: {
      type: String,
      required: [true, 'Resume content is required'],
      maxlength: [50000, 'Content cannot exceed 50000 characters'],
    },
    versionNumber: {
      type: String,
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
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
resumeVersionSchema.index({ user: 1, createdAt: -1 });

// Pre-save middleware to auto-generate version number
resumeVersionSchema.pre('save', async function (next) {
  if (this.isNew && !this.versionNumber) {
    const count = await this.constructor.countDocuments({ user: this.user });
    this.versionNumber = `v${count + 1}`;
  }
  next();
});

// Static method to get line count
resumeVersionSchema.methods.getLineCount = function () {
  return this.content ? this.content.split('\n').length : 0;
};

module.exports = mongoose.model('ResumeVersion', resumeVersionSchema);
