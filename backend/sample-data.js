const mongoose = require('mongoose');
const Job = require('./models/Job');

const sampleJobs = [
  {
    title: "SSC CGL 2024 - Combined Graduate Level Examination",
    organization: "Staff Selection Commission",
    category: "upcoming-job",
    description: "Staff Selection Commission (SSC) has released notification for Combined Graduate Level Examination (CGL) 2024.",
    lastDate: new Date('2024-02-15'),
    startDate: new Date('2024-01-15'),
    applicationFee: "₹100 (General/OBC), Free (SC/ST/Women)",
    applyLink: "https://ssc.nic.in",
    eligibility: "Bachelor's degree from a recognized university. Age limit: 18-32 years.",
    salary: "₹25,500 - ₹81,100 per month",
    posts: 17727
  },
  {
    title: "UPSC Civil Services 2023 - Final Result Declared",
    organization: "Union Public Service Commission",
    category: "result",
    description: "UPSC has declared the final result of Civil Services Examination 2023.",
    lastDate: new Date('2024-01-30'),
    startDate: new Date('2023-02-01'),
    applicationFee: "₹200 (General), ₹25 (SC/ST/Women)",
    applyLink: "https://upsc.gov.in",
    eligibility: "Bachelor's degree from recognized university. Age limit: 21-32 years.",
    salary: "₹56,100 - ₹2,50,000 per month",
    posts: 1105
  },
  {
    title: "GATE 2024 - Admit Card Available for Download",
    organization: "Indian Institute of Science",
    category: "admit-card",
    description: "Graduate Aptitude Test in Engineering (GATE) 2024 admit cards are now available.",
    lastDate: new Date('2024-02-04'),
    startDate: new Date('2023-08-24'),
    applicationFee: "₹1850 (General/OBC), ₹925 (SC/ST/PWD)",
    applyLink: "https://gate.iisc.ac.in",
    eligibility: "Bachelor's degree in Engineering/Technology or equivalent.",
    salary: "Varies based on organization",
    posts: 0
  }
];

async function insertSampleData() {
  try {
    await mongoose.connect('mongodb://localhost:27017/sarkari-result');
    console.log('Connected to MongoDB');

    await Job.deleteMany({});
    console.log('Cleared existing jobs');

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