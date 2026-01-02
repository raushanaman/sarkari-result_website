const express = require('express');
const Job = require('../models/Job');
const auth = require('../middleware/auth');
const { calculateDeletionDate, getJobsForDeletionNotification, markJobsAsNotified } = require('../services/autoDelete');
const router = express.Router();

// Get all jobs by category
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    let filter = { isActive: true };
    
    if (category) {
      filter.category = category;
    }
    
    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    console.log(`Found ${jobs.length} jobs for category: ${category || 'all'}`);
    res.json({ data: jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single job
router.get('/:id', async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create job (Admin only)
router.post('/', auth, async (req, res) => {
  try {
    const jobData = { ...req.body };
    
    // Basic validation - only fields with asterisks in frontend
    if (!jobData.title || !jobData.organization || !jobData.category || 
        !jobData.lastDate || !jobData.applyLink) {
      return res.status(400).json({ message: 'Missing required fields: Title, Organization, Category, Last Date, and Apply Link are required.' });
    }
    
    // No additional validation for description, eligibility, applicationFee - they are optional now
    // No validation for startDate, salary, posts - they are optional now
    
    // Clear job-specific fields for result and admit-card categories
    if (jobData.category === 'result' || jobData.category === 'admit-card') {
      delete jobData.startDate;
      delete jobData.salary;
      delete jobData.posts;
    }
    
    const job = new Job(jobData);
    
    // Calculate and set deletion date
    job.deletionScheduledAt = calculateDeletionDate(job);
    
    await job.save();
    res.status(201).json(job);
  } catch (error) {
    console.error('Job creation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update job (Admin only)
router.put('/:id', auth, async (req, res) => {
  try {
    const jobData = { ...req.body };
    
    // Clear job-specific fields for result and admit-card categories
    if (jobData.category === 'result' || jobData.category === 'admit-card') {
      jobData.startDate = undefined;
      jobData.salary = undefined;
      jobData.posts = undefined;
    }
    
    const job = await Job.findByIdAndUpdate(req.params.id, jobData, { new: true, runValidators: true });
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  } catch (error) {
    console.error('Job update error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete job (Admin only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.id);
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get jobs scheduled for deletion (Admin notification)
router.get('/admin/deletion-notifications', auth, async (req, res) => {
  try {
    const jobs = await getJobsForDeletionNotification();
    res.json({ data: jobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Confirm deletion of jobs
router.post('/admin/confirm-deletion', auth, async (req, res) => {
  try {
    const { jobIds } = req.body;
    
    await Job.updateMany(
      { _id: { $in: jobIds } },
      { isActive: false }
    );
    
    res.json({ message: 'Jobs deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Postpone deletion of jobs
router.post('/admin/postpone-deletion', auth, async (req, res) => {
  try {
    const { jobIds, days } = req.body;
    
    const jobs = await Job.find({ _id: { $in: jobIds } });
    
    for (const job of jobs) {
      const newDeletionDate = new Date(job.deletionScheduledAt);
      newDeletionDate.setDate(newDeletionDate.getDate() + (days || 7));
      
      await Job.findByIdAndUpdate(job._id, {
        deletionScheduledAt: newDeletionDate,
        deletionNotified: false
      });
    }
    
    res.json({ message: 'Deletion postponed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get jobs for admin dashboard
router.get('/admin/all', auth, async (req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json({ data: jobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;