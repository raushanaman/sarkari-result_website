const mongoose = require('mongoose');
const Job = require('./models/Job');

const sampleJobs = [
  // Sarkari Yojana (5)
  {
    title: "PM Kisan Samman Nidhi Yojana 2025",
    organization: "Ministry of Agriculture & Farmers Welfare",
    category: "sarkari-yojana",
    description: "Financial assistance of ₹6000 per year to small and marginal farmers across India. Direct benefit transfer to farmers' bank accounts in three equal installments.",
    eligibility: "Small and marginal farmers with landholding up to 2 hectares. Must have valid Aadhaar card and bank account.",
    lastDate: new Date('2025-03-31'),
    startDate: new Date('2025-01-15'),
    applicationFee: "Free",
    applyLink: "https://pmkisan.gov.in",
    organizationLink: "https://agriculture.gov.in",
    shortNoticeLink: "https://pmkisan.gov.in/Documents/PMKisan.pdf",
    syllabusLink: "",
    youtubeLink: "https://youtu.be/pmkisan-demo",
    posts: "10,00,000",
    salary: "₹6,000 per year"
  },
  {
    title: "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana",
    organization: "National Health Authority",
    category: "sarkari-yojana",
    description: "World's largest health insurance scheme providing coverage of ₹5 lakh per family per year for secondary and tertiary care hospitalization.",
    eligibility: "Families identified through Socio-Economic Caste Census (SECC) 2011. Rural and urban poor families are eligible.",
    lastDate: new Date('2025-12-31'),
    startDate: new Date('2025-01-01'),
    applicationFee: "Free",
    applyLink: "https://pmjay.gov.in",
    organizationLink: "https://nha.gov.in",
    shortNoticeLink: "https://pmjay.gov.in/about/pmjay",
    syllabusLink: "",
    youtubeLink: "https://youtu.be/ayushman-bharat",
    posts: "50,00,000",
    salary: "₹5,00,000 coverage per family"
  },
  {
    title: "PM Awas Yojana (Pradhan Mantri Awas Yojana)",
    organization: "Ministry of Housing and Urban Affairs",
    category: "sarkari-yojana",
    description: "Housing for All mission providing financial assistance for construction/purchase of houses for economically weaker sections and low-income groups.",
    eligibility: "EWS, LIG, and MIG families who do not own a pucca house. Annual income criteria as per category.",
    lastDate: new Date('2025-06-30'),
    startDate: new Date('2025-01-01'),
    applicationFee: "₹25",
    applyLink: "https://pmaymis.gov.in",
    organizationLink: "https://mohua.gov.in",
    shortNoticeLink: "https://pmaymis.gov.in/PDF/HFA_Guidelines.pdf",
    syllabusLink: "",
    youtubeLink: "https://youtu.be/pmay-housing",
    posts: "1,00,000",
    salary: "₹2.67 lakh subsidy"
  },
  {
    title: "Sukanya Samriddhi Yojana 2025",
    organization: "Ministry of Finance",
    category: "sarkari-yojana",
    description: "Small savings scheme for girl child education and marriage expenses. Tax benefits under Section 80C with attractive interest rates.",
    eligibility: "Girl child below 10 years of age. Indian resident. One account per girl child. Maximum 2 accounts per family.",
    lastDate: new Date('2025-12-31'),
    startDate: new Date('2025-01-01'),
    applicationFee: "Free",
    applyLink: "https://www.indiapost.gov.in/VAS/Pages/Sukanya.aspx",
    organizationLink: "https://finmin.nic.in",
    shortNoticeLink: "https://www.indiapost.gov.in/VAS/DOP_PDFs/Sukanya%20Samriddhi%20Yojana.pdf",
    syllabusLink: "",
    youtubeLink: "https://youtu.be/sukanya-samriddhi",
    posts: "Unlimited",
    salary: "8.2% interest rate"
  },
  {
    title: "Pradhan Mantri Mudra Yojana (PMMY)",
    organization: "Ministry of Finance",
    category: "sarkari-yojana",
    description: "Micro-finance scheme providing loans up to ₹10 lakh to small businesses and entrepreneurs without collateral.",
    eligibility: "Small business owners, entrepreneurs, self-employed individuals. No collateral required. Good credit history preferred.",
    lastDate: new Date('2025-12-31'),
    startDate: new Date('2025-01-01'),
    applicationFee: "Free",
    applyLink: "https://www.mudra.org.in",
    organizationLink: "https://finmin.nic.in",
    shortNoticeLink: "https://www.mudra.org.in/Document/Mudra_Yojana_Guidelines.pdf",
    syllabusLink: "",
    youtubeLink: "https://youtu.be/mudra-yojana",
    posts: "Unlimited",
    salary: "Up to ₹10 lakh loan"
  }
];

async function insertSampleData() {
  try {
    await mongoose.connect('mongodb+srv://kcwjan2026_db_user:W1qKg1VDh%40uTudI7j%21@ksjobs.dpxzod0.mongodb.net/sarkari-result?retryWrites=true&w=majority&appName=KSJOBS');
    console.log('Connected to MongoDB');

    // Only insert Sarkari Yojana data
    await Job.deleteMany({ category: 'sarkari-yojana' });
    console.log('Cleared existing Sarkari Yojana jobs');

    await Job.insertMany(sampleJobs);
    console.log(`Inserted ${sampleJobs.length} Sarkari Yojana jobs`);

    console.log('Sarkari Yojana demo data inserted successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error inserting sample data:', error);
    process.exit(1);
  }
}

insertSampleData();