import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import { FaCalendarAlt, FaBuilding, FaMoneyBillWave, FaUsers, FaExternalLinkAlt, FaArrowLeft, FaWhatsapp, FaInstagram, FaGraduationCap, FaFileAlt } from 'react-icons/fa';
import { CATEGORY_SECTION_CONFIG, splitLines } from '../constants/categorySections';

const JobDetails = () => {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await jobsAPI.getJob(id);
      setJob(response.data);
    } catch (error) {
      console.error('Error fetching job:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getActionButtonText = (category) => {
    switch (category) {
      case 'result':
        return 'Check Result';
      case 'admit-card':
        return 'Download Admit Card';
      case 'upcoming-job':
        return 'Apply Now';
      default:
        return 'View Details';
    }
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        fontSize: '1.125rem'
      }}>
        Loading...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container" style={{ padding: '2rem 0', textAlign: 'center' }}>
        <h2>Job not found</h2>
        <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          Go Back Home
        </Link>
      </div>
    );
  }

  const detailSections = CATEGORY_SECTION_CONFIG[job.category] || [];

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <div className="container" style={{ padding: '2rem 0' }}>
        <Link to="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.5rem',
          color: '#3b82f6',
          textDecoration: 'none',
          marginBottom: '2rem',
          fontWeight: '600',
          animation: 'slideInLeft 0.6s ease-out'
        }}>
          <FaArrowLeft />
          Back to Home
        </Link>

        {/* Main Title Section */}
        <div style={{
          background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
          color: 'white',
          padding: '2rem',
          borderRadius: '16px',
          marginBottom: '2rem',
          textAlign: 'center',
          animation: 'slideInDown 0.8s ease-out',
          boxShadow: '0 20px 40px rgba(59, 130, 246, 0.3)'
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            margin: '0 0 0.5rem 0',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}>
            {job.title}
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, margin: 0 }}>
            {job.organization}
          </p>
        </div>

        {/* How to Apply Section */}
        <div style={{
          background: 'white',
          border: '3px solid #3b82f6',
          borderRadius: '12px',
          marginBottom: '2rem',
          overflow: 'hidden',
          animation: 'slideInUp 1s ease-out 0.2s both',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <div style={{
            background: '#3b82f6',
            color: 'white',
            padding: '1rem',
            textAlign: 'center',
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>
            How To Apply For {job.title}
          </div>
          <div style={{ padding: '1.5rem' }}>
            <ul style={{ margin: 0, paddingLeft: '1.5rem', lineHeight: '1.8' }}>
              <li style={{ marginBottom: '0.8rem' }}>
                <strong>Interested Candidates</strong> Who Wish To Apply For The <strong>{job.organization}</strong> Post Can Submit Their Application Online Before <strong style={{ color: '#dc2626' }}>{formatDate(job.lastDate)}</strong>.
              </li>
              <li style={{ marginBottom: '0.8rem' }}>
                Use The Click Here Link Provided Below Under Important Link Section To Apply Directly.
              </li>
              <li style={{ marginBottom: '0.8rem' }}>
                Alternatively, Visit The <strong>Official Website Of {job.organization}</strong> To Complete The Application Process Online.
              </li>
              <li style={{ marginBottom: '0.8rem' }}>
                Make Sure To Complete The Application Before The Deadline <strong style={{ color: '#dc2626' }}>{formatDate(job.lastDate)}</strong>.
              </li>
              <li>
                <strong>Note</strong> - छात्रों से ये अनुरोध किया जाता है की वो अपना फॉर्म भरने से पहले Official Notification को ध्यान से जरूर पढ़े उसके बाद ही अपना फॉर्म भरे । <strong>(Last Date, Age Limit, & Education Qualification)</strong>
              </li>
            </ul>
          </div>
        </div>

        {/* Key Details Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            animation: 'slideInLeft 1s ease-out 0.4s both'
          }}>
            <h3 style={{ color: '#1e40af', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaCalendarAlt /> {job.category === 'result' || job.category === 'admit-card' ? 'Post Date' : 'Last Date'}
            </h3>
            <p style={{ fontSize: '1.1rem', fontWeight: '600', color: '#dc2626' }}>{formatDate(job.lastDate)}</p>
          </div>

          <div style={{
            background: 'white',
            padding: '1.5rem',
            borderRadius: '12px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            animation: 'slideInUp 1s ease-out 0.6s both'
          }}>
            <h3 style={{ color: '#1e40af', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FaMoneyBillWave /> Application Fee
            </h3>
            <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{job.applicationFee}</p>
          </div>

          {job.posts && (
            <div style={{
              background: 'white',
              padding: '1.5rem',
              borderRadius: '12px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
              animation: 'slideInRight 1s ease-out 0.8s both'
            }}>
              <h3 style={{ color: '#1e40af', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FaUsers /> Total Posts
              </h3>
              <p style={{ fontSize: '1.1rem', fontWeight: '600' }}>{job.posts}</p>
            </div>
          )}
        </div>

        {/* Description & Eligibility */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            animation: 'slideInLeft 1s ease-out 1s both'
          }}>
            <h3 style={{ color: '#1e40af', marginBottom: '1rem' }}>Description</h3>
            <p style={{ lineHeight: '1.7', color: '#374151' }}>{job.description}</p>
          </div>

          <div style={{
            background: 'white',
            padding: '2rem',
            borderRadius: '12px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
            animation: 'slideInRight 1s ease-out 1.2s both'
          }}>
            <h3 style={{ color: '#1e40af', marginBottom: '1rem' }}>Eligibility Criteria</h3>
            <p style={{ lineHeight: '1.7', color: '#374151' }}>{job.eligibility}</p>
          </div>
        </div>

        {/* Additional Details */}
        {detailSections.length > 0 && (
          <div style={{
            background: 'white',
            border: '3px solid #10b981',
            borderRadius: '12px',
            marginBottom: '2rem',
            overflow: 'hidden',
            animation: 'slideInUp 1s ease-out 1.4s both'
          }}>
            <div style={{
              background: '#10b981',
              color: 'white',
              padding: '1rem',
              textAlign: 'center',
              fontSize: '1.2rem',
              fontWeight: 'bold'
            }}>
              {job.title} : Additional Information
            </div>
            <div style={{ padding: '2rem' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}>
                {detailSections.map((section) => {
                  const value = job.details?.[section.key];
                  if (!value) return null;
                  return (
                    <div key={section.key}>
                      <h4 style={{ color: '#10b981', marginBottom: '0.5rem' }}>{section.label}</h4>
                      <p style={{ lineHeight: '1.6', color: '#374151' }}>{value}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Social Links */}
        <div className="social-links" aria-label="Social channels" style={{ marginBottom: '2rem' }}>
          <a
            href={job.whatsappLink || 'https://chat.whatsapp.com/sample-invite'}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link social-link--whatsapp"
          >
            <div className="social-link__icon"><FaWhatsapp size={20} /></div>
            <div className="social-link__content">
              <div className="social-link__title">Join Our WhatsApp Channel</div>
              <div className="social-link__cta">Follow Now</div>
            </div>
          </a>

          <a
            href={job.instagramLink || 'https://instagram.com/sample'}
            target="_blank"
            rel="noopener noreferrer"
            className="social-link social-link--instagram"
          >
            <div className="social-link__icon"><FaInstagram size={20} /></div>
            <div className="social-link__content">
              <div className="social-link__title">Follow Our Instagram Channel</div>
              <div className="social-link__cta">Follow Now</div>
            </div>
          </a>
        </div>

        {/* Important Links (redesigned) */}
        <section className="important-links">
          <header className="important-links__header">
            <h3 className="important-links__title">Some useful important links</h3>
            <p className="important-links__meta">Quick actions and official resources for this vacancy</p>
          </header>

          <div className="important-links__grid">
            <a
              className="important-links__primary"
              href={job.applyLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${getActionButtonText(job.category)} - ${job.organization}`}
            >
              <div className="important-links__primary-content">
                <div className="important-links__badge">{getActionButtonText(job.category)}</div>
                <div className="important-links__primary-cta">Apply Now</div>
                <div className="important-links__org">{job.organization}</div>
              </div>
              <div className="important-links__arrow">↗</div>
            </a>

            <div className="important-links__secondary">
              <a className="important-links__link" href={job.organizationLink || job.applyLink} target="_blank" rel="noopener noreferrer">Official Website</a>
              <a className="important-links__link" href={job.shortNoticeLink || '#'} target="_blank" rel="noopener noreferrer">Check Short Notice</a>
              <a className="important-links__link" href={job.syllabusLink || '#'} target="_blank" rel="noopener noreferrer">Download Syllabus / Notification</a>
            </div>
          </div>

          <div className="important-links__footer">
            <small>Always verify details on the official website before applying. (Last date: {formatDate(job.lastDate)})</small>
          </div>
        </section>
      </div>
    </div>
  );
};

export default JobDetails;