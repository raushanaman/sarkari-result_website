const baseBannerFields = [
  {
    key: 'heroLine1',
    label: 'Primary Banner Line',
    type: 'text',
    placeholder: 'Authority / Organization Name',
    helper: 'Shown as the first bold line in the hero block.'
  },
  {
    key: 'heroLine2',
    label: 'Secondary Banner Line',
    type: 'text',
    placeholder: 'Exam / Recruitment Title',
    helper: 'Appears just below the authority line (e.g., BEL Probationary Engineer Admit Card 2025).'
  },
  {
    key: 'heroLine3',
    label: 'Portal Tagline',
    type: 'text',
    placeholder: 'SARKARIRESULT.COM.IM',
    helper: 'Short branding or portal line.'
  }
];

const listStyleHelper = 'Add one entry per line. Use the pattern "Label: Detail" to keep formatting consistent.';

export const CATEGORY_SECTION_CONFIG = {
  'admit-card': [
    ...baseBannerFields,
    {
      key: 'importantDates',
      label: 'Important Dates',
      type: 'textarea',
      placeholder: 'Notification Date: 24 October 2025\nApplication Start: 24 October 2025\nAdmit Card Date: 13 December 2025',
      helper: `${listStyleHelper} Example: "Admit Card Date: 13 December 2025".`
    },
    {
      key: 'applicationFee',
      label: 'Application Fee Details',
      type: 'textarea',
      placeholder: 'GEN/ EWS/ OBC (NCL): ₹1000\nSC/ ST/ PwBD/ ESM: ₹00\nPayment Mode: Credit / Debit Card, Net Banking',
      helper: listStyleHelper
    },
    {
      key: 'ageLimit',
      label: 'Age Limit Block',
      type: 'textarea',
      placeholder: 'Minimum Age: 18 Years\nMaximum Age: 25 Years\nRefer to notification for relaxations.',
      helper: listStyleHelper
    },
    {
      key: 'totalPosts',
      label: 'Total Posts Summary',
      type: 'textarea',
      placeholder: '340 Posts\nRead the official notification for category wise distribution.',
      helper: 'Mention total posts and supporting notes.'
    },
    {
      key: 'eligibilityDetails',
      label: 'Eligibility & Vacancy Details',
      type: 'textarea',
      placeholder: 'BEL Probationary Engineer Vacancy 2025 - 340 - B.E./B.Tech in related field.',
      helper: 'Summaries for eligibility plus brief vacancy notes.'
    },
    {
      key: 'salaryPerks',
      label: 'Salary & Allowances',
      type: 'textarea',
      placeholder: 'Pay Scale: ₹40,000/- to ₹1,40,000/- per month\nAllowances: HRA, DA, TA as per norms.',
      helper: listStyleHelper
    },
    {
      key: 'examPattern',
      label: 'Exam Pattern / Syllabus',
      type: 'textarea',
      placeholder: 'Technical Subject - 100 Questions - 120 Minutes\nGeneral Aptitude - 25 Questions - 25 Marks',
      helper: listStyleHelper
    },
    {
      key: 'selectionProcess',
      label: 'Selection Process Steps',
      type: 'textarea',
      placeholder: 'Written Exam\nDocument Verification\nMedical Examination',
      helper: 'One step per line.'
    },
    {
      key: 'howTo',
      label: 'How-To / Download Steps',
      type: 'textarea',
      placeholder: 'Visit bel-india.in\nOpen the BEL Probationary Engineer Admit Card link\nEnter Application Number & DOB\nDownload and print.',
      helper: 'Describe detailed instructions users should follow.'
    }
  ],
  'upcoming-job': [
    ...baseBannerFields,
    {
      key: 'importantDates',
      label: 'Important Dates',
      type: 'textarea',
      placeholder: 'Application Start: 14 November 2025\nLast Date: 11 December 2025\nTier 1 Exam: 10 & 11 January 2025',
      helper: listStyleHelper
    },
    {
      key: 'applicationFee',
      label: 'Application Fee Slabs',
      type: 'textarea',
      placeholder: 'Assistant Commissioner: Gen/OBC/EWS ₹2800, SC/ST/PH ₹500\nPGT/TGT/PRT: Gen/OBC/EWS ₹2000, SC/ST/PH ₹500',
      helper: listStyleHelper
    },
    {
      key: 'ageLimit',
      label: 'Age Limit & Reference Date',
      type: 'textarea',
      placeholder: 'Minimum Age: 18 Years\nMaximum Age: 40 Years (post-wise)\nCut-off Date: 04 December 2025',
      helper: listStyleHelper
    },
    {
      key: 'totalPosts',
      label: 'Total Posts Summary',
      type: 'textarea',
      placeholder: 'Total Vacancies: 15,762 Posts\nRefer notification for category wise split.',
      helper: 'Highlight total posts plus any quick pointers.'
    },
    {
      key: 'vacancyBreakdown',
      label: 'Post Wise Vacancy Snapshot',
      type: 'textarea',
      placeholder: 'Assistant Commissioner: 08\nPrincipal: 134\nPGTs: 1465\nTGTs: 2794\n...',
      helper: listStyleHelper
    },
    {
      key: 'eligibilityDetails',
      label: 'Eligibility Highlights',
      type: 'textarea',
      placeholder: 'Eligibility varies from 10th/ 12th to PG with CTET. Refer notification for details.',
      helper: 'Summarize overall eligibility expectations.'
    },
    {
      key: 'salaryPerks',
      label: 'Salary & Pay Level',
      type: 'textarea',
      placeholder: 'Pay Level: Post-wise\nAllowances: As per Government norms.',
      helper: listStyleHelper
    },
    {
      key: 'selectionProcess',
      label: 'Selection Process',
      type: 'textarea',
      placeholder: 'Written Examination\nSkill / Practical Test\nInterview (if applicable)\nDocument Verification\nMedical Examination',
      helper: 'One phase per line.'
    },
    {
      key: 'howTo',
      label: 'Application Steps',
      type: 'textarea',
      placeholder: 'Visit cbse.gov.in / kvsangathan.nic.in / navodaya.gov.in\nFill online form\nUpload required documents\nPay fees\nPrint confirmation.',
      helper: 'Provide concise instructions for applying online.'
    }
  ],
  result: [
    ...baseBannerFields,
    {
      key: 'importantDates',
      label: 'Important Dates Timeline',
      type: 'textarea',
      placeholder: 'Notification Date: 25 April 2025\nExam Dates: 30 July – 03 August 2025\nResult Date: 11 December 2025',
      helper: listStyleHelper
    },
    {
      key: 'applicationFee',
      label: 'Fee Snapshot',
      type: 'textarea',
      placeholder: 'Gen/EWS/BC/EBC: ₹600\nSC/ST (Bihar): ₹150\nFemale (All Categories): ₹150',
      helper: listStyleHelper
    },
    {
      key: 'ageLimit',
      label: 'Age Limit As On Date',
      type: 'textarea',
      placeholder: 'Minimum Age: 18 Years\nMaximum Age (Male): 37 Years\nMaximum Age (Female): 40 Years',
      helper: listStyleHelper
    },
    {
      key: 'totalPosts',
      label: 'Total Vacancies',
      type: 'textarea',
      placeholder: 'Total Posts: 11,389\nRead the notification for complete distribution.',
      helper: 'Call out important post numbers and supporting note.'
    },
    {
      key: 'eligibilityDetails',
      label: 'Eligibility Summary',
      type: 'textarea',
      placeholder: 'B.Sc Nursing / Diploma / Certificate in Nursing or equivalent from recognized institution.',
      helper: 'Short paragraph on required qualifications.'
    },
    {
      key: 'salaryPerks',
      label: 'Salary & Pay Level',
      type: 'textarea',
      placeholder: 'Pay Scale: ₹9,300 – ₹34,800 (Level-7)\nGrade Pay: ₹4,600\nOther Allowances: As per Government Rules.',
      helper: listStyleHelper
    },
    {
      key: 'selectionProcess',
      label: 'Selection Process',
      type: 'textarea',
      placeholder: 'Written Exam\nInterview (Viva Voce)\nDocument Verification\nMedical Examination',
      helper: 'Enumerate every stage.'
    },
    {
      key: 'howTo',
      label: 'How To Check Result',
      type: 'textarea',
      placeholder: 'Visit btsc.bihar.gov.in\nOpen Staff Nurse Result link\nEnter Roll / Application Number & DOB\nDownload the scorecard.',
      helper: 'Step-by-step guidance for result download.'
    }
  ],
  'sarkari-yojana': [
    ...baseBannerFields,
    {
      key: 'importantDates',
      label: 'Important Dates',
      type: 'textarea',
      placeholder: 'Scheme Launch: 01 January 2025\nApplication Start: 15 January 2025\nLast Date: 31 March 2025',
      helper: `${listStyleHelper} Example: "Application Start: 15 January 2025".`
    },
    {
      key: 'applicationFee',
      label: 'Application Fee Details',
      type: 'textarea',
      placeholder: 'Application Fee: Free\nNo charges for application\nOnline application only',
      helper: listStyleHelper
    },
    {
      key: 'ageLimit',
      label: 'Age Limit / Eligibility Age',
      type: 'textarea',
      placeholder: 'Minimum Age: 18 Years\nMaximum Age: 60 Years\nAs per scheme guidelines',
      helper: listStyleHelper
    },
    {
      key: 'totalPosts',
      label: 'Scheme Coverage / Beneficiaries',
      type: 'textarea',
      placeholder: 'Target Beneficiaries: 10,00,000\nCoverage: Pan India\nRefer to guidelines for state-wise allocation.',
      helper: 'Mention target beneficiaries and coverage area.'
    },
    {
      key: 'eligibilityDetails',
      label: 'Eligibility Criteria',
      type: 'textarea',
      placeholder: 'PM Kisan Yojana 2025 - For farmers with landholding up to 2 hectares.',
      helper: 'Detailed eligibility requirements for the scheme.'
    },
    {
      key: 'salaryPerks',
      label: 'Scheme Benefits / Amount',
      type: 'textarea',
      placeholder: 'Financial Assistance: ₹6,000/- per year\nPayment Mode: Direct Bank Transfer\nInstallments: 3 equal installments of ₹2,000 each',
      helper: listStyleHelper
    },
    {
      key: 'selectionProcess',
      label: 'Application Process',
      type: 'textarea',
      placeholder: 'Online Application\nDocument Verification\nBank Account Verification\nApproval Process',
      helper: 'One step per line for application process.'
    },
    {
      key: 'howTo',
      label: 'How to Apply / Required Documents',
      type: 'textarea',
      placeholder: 'Visit pmkisan.gov.in\nClick on New Farmer Registration\nEnter Aadhaar Number\nFill required details\nUpload documents: Aadhaar, Bank Passbook, Land Records\nSubmit application.',
      helper: 'Step-by-step application process and required documents.'
    }
  ],
  scholarship: [
    ...baseBannerFields,
    {
      key: 'importantDates',
      label: 'Important Dates',
      type: 'textarea',
      placeholder: 'Application Start: 15 November 2025\nLast Date: 20 December 2025\nResult Date: 10 January 2026',
      helper: `${listStyleHelper} Example: "Application Start: 15 November 2025".`
    },
    {
      key: 'applicationFee',
      label: 'Application Fee Details',
      type: 'textarea',
      placeholder: 'GEN/ EWS/ OBC: ₹500\nSC/ ST/ PwBD: ₹00\nPayment Mode: Online',
      helper: listStyleHelper
    },
    {
      key: 'ageLimit',
      label: 'Age Limit',
      type: 'textarea',
      placeholder: 'Minimum Age: 18 Years\nMaximum Age: 25 Years\nRefer to notification for relaxations.',
      helper: listStyleHelper
    },
    {
      key: 'totalPosts',
      label: 'Total Scholarships',
      type: 'textarea',
      placeholder: '500 Scholarships\nRead the official notification for category wise distribution.',
      helper: 'Mention total scholarships and supporting notes.'
    },
    {
      key: 'eligibilityDetails',
      label: 'Eligibility Details',
      type: 'textarea',
      placeholder: 'Merit Based Scholarship 2025 - For students pursuing graduation/post-graduation.',
      helper: 'Summaries for eligibility requirements.'
    },
    {
      key: 'salaryPerks',
      label: 'Scholarship Amount',
      type: 'textarea',
      placeholder: 'Amount: ₹50,000/- per year\nDuration: Complete course duration',
      helper: listStyleHelper
    },
    {
      key: 'selectionProcess',
      label: 'Selection Process',
      type: 'textarea',
      placeholder: 'Merit Based Selection\nDocument Verification\nInterview (if applicable)',
      helper: 'One step per line.'
    },
    {
      key: 'howTo',
      label: 'How to Apply',
      type: 'textarea',
      placeholder: 'Visit official website\nFill online application\nUpload required documents\nSubmit application.',
      helper: 'Describe detailed instructions for application.'
    }
  ],
  admission: [
    ...baseBannerFields,
    {
      key: 'importantDates',
      label: 'Important Dates',
      type: 'textarea',
      placeholder: 'Application Start: 01 December 2025\nLast Date: 31 December 2025\nEntrance Exam: 15 January 2026',
      helper: `${listStyleHelper} Example: "Application Start: 01 December 2025".`
    },
    {
      key: 'applicationFee',
      label: 'Application Fee Details',
      type: 'textarea',
      placeholder: 'GEN/ EWS/ OBC: ₹1500\nSC/ ST/ PwBD: ₹750\nPayment Mode: Online/Offline',
      helper: listStyleHelper
    },
    {
      key: 'ageLimit',
      label: 'Age Limit',
      type: 'textarea',
      placeholder: 'Minimum Age: 17 Years\nMaximum Age: 23 Years\nAs on 31st December 2025',
      helper: listStyleHelper
    },
    {
      key: 'totalPosts',
      label: 'Total Seats',
      type: 'textarea',
      placeholder: 'Total Seats: 1000\nRead the prospectus for course wise distribution.',
      helper: 'Mention total seats and supporting notes.'
    },
    {
      key: 'eligibilityDetails',
      label: 'Eligibility Details',
      type: 'textarea',
      placeholder: 'University Admission 2025 - 12th Pass with minimum 60% marks.',
      helper: 'Summaries for eligibility requirements.'
    },
    {
      key: 'salaryPerks',
      label: 'Course Fee',
      type: 'textarea',
      placeholder: 'Course Fee: ₹1,00,000/- per year\nHostel Fee: ₹50,000/- per year',
      helper: listStyleHelper
    },
    {
      key: 'selectionProcess',
      label: 'Selection Process',
      type: 'textarea',
      placeholder: 'Entrance Examination\nCounselling\nDocument Verification\nSeat Allotment',
      helper: 'One step per line.'
    },
    {
      key: 'howTo',
      label: 'How to Apply',
      type: 'textarea',
      placeholder: 'Visit university website\nFill online application\nUpload required documents\nPay application fee\nSubmit application.',
      helper: 'Describe detailed instructions for application.'
    }
  ]
};

export const getSectionDefaults = (category) => {
  const template = CATEGORY_SECTION_CONFIG[category] || [];
  return template.reduce((acc, field) => {
    acc[field.key] = '';
    return acc;
  }, {});
};

export const ensureSectionDefaults = (category, details = {}) => {
  const defaults = getSectionDefaults(category);
  return {
    ...defaults,
    ...details
  };
};

export const splitLines = (value = '') =>
  value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
