const mongoose = require('mongoose');

// Job Schema
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

const Job = mongoose.model('Job', JobSchema);

// Sample data
const sampleJobs = [
  // Upcoming Jobs
  {
    title: "SSC CGL 2024 - Combined Graduate Level Examination",
    organization: "Staff Selection Commission",
    category: "upcoming-job",
    description: "Staff Selection Commission (SSC) has released notification for Combined Graduate Level Examination (CGL) 2024. Eligible candidates can apply online for various Group B and Group C posts in different ministries and departments of Government of India.",
    lastDate: new Date('2024-02-15'),
    startDate: new Date('2024-01-15'),
    applicationFee: "₹100 (General/OBC), Free (SC/ST/Women)",
    applyLink: "https://ssc.nic.in",
    eligibility: "Bachelor's degree from a recognized university. Age limit: 18-32 years (relaxation as per rules).",
    salary: "₹25,500 - ₹81,100 per month",
    posts: 17727
  },
  {
    title: "IBPS PO 2024 - Probationary Officer Recruitment",
    organization: "Institute of Banking Personnel Selection",
    category: "upcoming-job",
    description: "IBPS has announced recruitment for Probationary Officer posts in various public sector banks. This is a great opportunity for graduates to start their banking career.",
    lastDate: new Date('2024-02-28'),
    startDate: new Date('2024-01-20'),
    applicationFee: "₹850 (General/OBC), ₹175 (SC/ST/PWD)",
    applyLink: "https://ibps.in",
    eligibility: "Graduation in any discipline from a recognized university. Age limit: 20-30 years.",
    salary: "₹23,700 - ₹42,020 per month",
    posts: 4135
  },
  {
    title: "Railway Group D 2024 - Level 1 Posts",
    organization: "Railway Recruitment Board",
    category: "upcoming-job",
    description: "Railway Recruitment Board invites applications for Group D Level 1 posts including Track Maintainer, Helper, Assistant Pointsman, and other technical posts across Indian Railways.",
    lastDate: new Date('2024-03-10'),
    startDate: new Date('2024-02-01'),
    applicationFee: "₹500 (General/OBC), ₹250 (SC/ST)",
    applyLink: "https://rrbcdg.gov.in",
    eligibility: "10th pass or ITI from recognized institute. Age limit: 18-33 years.",
    salary: "₹18,000 - ₹56,900 per month",
    posts: 103769
  },

  // Results
  {
    title: "UPSC Civil Services 2023 - Final Result Declared",
    organization: "Union Public Service Commission",
    category: "result",
    description: "UPSC has declared the final result of Civil Services Examination 2023. Candidates can check their result and download the merit list from the official website.",
    lastDate: new Date('2024-01-30'),
    startDate: new Date('2023-02-01'),
    applicationFee: "₹200 (General), ₹25 (SC/ST/Women)",
    applyLink: "https://upsc.gov.in",
    eligibility: "Bachelor's degree from recognized university. Age limit: 21-32 years.",
    salary: "₹56,100 - ₹2,50,000 per month",
    posts: 1105
  },
  {
    title: "SBI Clerk 2023 - Final Result Published",
    organization: "State Bank of India",
    category: "result",
    description: "State Bank of India has published the final result for Clerk recruitment 2023. Selected candidates will be called for document verification and joining formalities.",
    lastDate: new Date('2023-12-15'),
    startDate: new Date('2023-10-01'),
    applicationFee: "₹750 (General/OBC), ₹125 (SC/ST/PWD)",
    applyLink: "https://sbi.co.in/careers",
    eligibility: "Graduation in any discipline. Age limit: 20-28 years.",
    salary: "₹17,900 - ₹63,200 per month",
    posts: 8773
  },

  // Admit Cards
  {
    title: "GATE 2024 - Admit Card Available for Download",
    organization: "Indian Institute of Science",
    category: "admit-card",
    description: "Graduate Aptitude Test in Engineering (GATE) 2024 admit cards are now available for download. Candidates can download their hall tickets from the official GATE website.",
    lastDate: new Date('2024-02-04'),
    startDate: new Date('2023-08-24'),
    applicationFee: "₹1850 (General/OBC), ₹925 (SC/ST/PWD)",
    applyLink: "https://gate.iisc.ac.in",
    eligibility: "Bachelor's degree in Engineering/Technology or equivalent.",
    salary: "Varies based on organization",
    posts: 0
  },
  {
    title: "JEE Main 2024 Session 1 - Hall Ticket Released",
    organization: "National Testing Agency",
    category: "admit-card",
    description: "National Testing Agency has released the admit cards for JEE Main 2024 Session 1. Candidates can download their hall tickets using application number and date of birth.",
    lastDate: new Date('2024-01-31'),
    startDate: new Date('2023-11-01'),
    applicationFee: "₹1000 (General/OBC), ₹500 (SC/ST/PWD)",
    applyLink: "https://jeemain.nta.nic.in",
    eligibility: "12th pass or appearing with Physics, Chemistry, Mathematics.",
    salary: "Not Applicable",
    posts: 0
  }
];

// Insert sample data
async function insertSampleData() {
  try {
    // Connect to MongoDB
    await mongoose.connect('mongodb://localhost:27017/sarkari-result', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing jobs
    await Job.deleteMany({});
    console.log('Cleared existing jobs');

    // Insert sample jobs
    await Job.insertMany(sampleJobs);
    console.log(`Inserted ${sampleJobs.length} sample jobs`);

    console.log('Sample data inserted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error inserting sample data:', error);
    process.exit(1);
  }
}

insertSampleData();