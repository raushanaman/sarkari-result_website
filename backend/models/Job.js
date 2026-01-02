const mongoose = require('mongoose');

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  organization: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['result', 'admit-card', 'upcoming-job', 'scholarship', 'admission'],
    required: true
  },
  description: {
    type: String,
    required: false
  },
  lastDate: {
    type: Date,
    required: true
  },
  startDate: {
    type: Date,
    required: false
  },
  applicationFee: {
    type: String,
    required: false
  },
  applyLink: {
    type: String,
    required: true,
    trim: true
  },
  organizationLink: {
    type: String,
    required: false,
    trim: true
  },
  shortNoticeLink: {
    type: String,
    required: false,
    trim: true
  },
  syllabusLink: {
    type: String,
    required: false,
    trim: true
  },
  eligibility: {
    type: String,
    required: false
  },
  salary: {
    type: String,
    required: false
  },
  posts: {
    type: Number,
    required: false
  },
  youtubeLink: {
    type: String,
    required: false,
    trim: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  deletionScheduledAt: {
    type: Date,
    required: false
  },
  deletionNotified: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('Job', JobSchema);