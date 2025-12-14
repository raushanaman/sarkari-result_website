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
    enum: ['result', 'admit-card', 'upcoming-job'],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  lastDate: {
    type: Date,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  applicationFee: {
    type: String,
    required: true
  },
  applyLink: {
    type: String,
    required: true
  },
  eligibility: {
    type: String,
    required: true
  },
  salary: {
    type: String,
    required: true
  },
  posts: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Job', JobSchema);