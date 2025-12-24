import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import {
  FaCalendarAlt,
  FaMoneyBillWave,
  FaUsers,
  FaArrowLeft,
  FaWhatsapp,
  FaInstagram
} from 'react-icons/fa';
import { CATEGORY_SECTION_CONFIG } from '../constants/categorySections';
import './JobDetails.css';

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
      <div className="job-details-page job-details__loading" role="status" aria-live="polite">
        Loading...
      </div>
    );
  }

  if (!job) {
    return (
      <div className="job-details-page">
        <div className="container job-details-container job-details__empty">
          <h2>Job not found</h2>
          <Link to="/" className="btn btn-primary">
            Go Back Home
          </Link>
        </div>
      </div>
    );
  }

  const detailSections = CATEGORY_SECTION_CONFIG[job.category] || [];

  return (
    <div className="job-details-page">
      <div className="container job-details-container">
        <Link to="/" className="job-details__back-link">
          <FaArrowLeft />
          Back to Home
        </Link>

        <section className="job-hero" aria-labelledby="job-title">
          <h1 id="job-title" className="job-hero__title">
            {job.title}
          </h1>
          <p className="job-hero__subtitle">{job.organization}</p>
        </section>

        <section className="job-details-card job-apply-card" aria-labelledby="job-apply-heading">
          <header className="job-apply-card__header" id="job-apply-heading">
            How To Apply For {job.title}
          </header>
          <div className="job-apply-card__body">
            <ul className="job-apply-card__list">
              <li>
                <strong>Interested Candidates</strong> Who Wish To Apply For The <strong>{job.organization}</strong> Post Can Submit Their Application Online Before{' '}
                <strong className="job-details__deadline">{formatDate(job.lastDate)}</strong>.
              </li>
              <li>Use The Click Here Link Provided Below Under Important Link Section To Apply Directly.</li>
              <li>
                Alternatively, Visit The <strong>Official Website Of {job.organization}</strong> To Complete The Application Process Online.
              </li>
              <li>
                Make Sure To Complete The Application Before The Deadline <strong className="job-details__deadline">{formatDate(job.lastDate)}</strong>.
              </li>
              <li className="job-details__notice">
                <strong>Note</strong> - छात्रों से ये अनुरोध किया जाता है की वो अपना फॉर्म भरने से पहले Official Notification को ध्यान से जरूर पढ़े उसके बाद ही अपना फॉर्म भरे ।{' '}
                <strong>(Last Date, Age Limit, &amp; Education Qualification)</strong>
              </li>
            </ul>
          </div>
        </section>

        <section className="job-keygrid" aria-label="Key job statistics">
          <article className="job-details-card job-keygrid__item">
            <h3>
              <FaCalendarAlt /> {job.category === 'result' || job.category === 'admit-card' ? 'Post Date' : 'Last Date'}
            </h3>
            <p className="job-details__metric job-details__metric--alert">{formatDate(job.lastDate)}</p>
          </article>

          <article className="job-details-card job-keygrid__item">
            <h3>
              <FaMoneyBillWave /> Application Fee
            </h3>
            <p className="job-details__metric">{job.applicationFee}</p>
          </article>

          {job.posts && (
            <article className="job-details-card job-keygrid__item">
              <h3>
                <FaUsers /> Total Posts
              </h3>
              <p className="job-details__metric">{job.posts}</p>
            </article>
          )}
        </section>

        <section className="job-section-grid">
          <article className="job-details-card job-section">
            <h3 className="job-section__title">Description</h3>
            <p className="job-section__text">{job.description}</p>
          </article>

          <article className="job-details-card job-section">
            <h3 className="job-section__title">Eligibility Criteria</h3>
            <p className="job-section__text">{job.eligibility}</p>
          </article>
        </section>

        {detailSections.length > 0 && (
          <section className="job-details-card job-additional" aria-labelledby="job-additional-heading">
            <header className="job-additional__header" id="job-additional-heading">
              {job.title} : Additional Information
            </header>
            <div className="job-additional__grid">
              {detailSections.map((section) => {
                const value = job.details?.[section.key];
                if (!value) return null;
                return (
                  <article key={section.key} className="job-additional__item">
                    <h4>{section.label}</h4>
                    <p>{value}</p>
                  </article>
                );
              })}
            </div>
          </section>
        )}

        <section className="job-details-social" aria-label="Social channels">
          <div className="social-links">
            <a
              href={job.whatsappLink || 'https://chat.whatsapp.com/sample-invite'}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link social-link--whatsapp"
            >
              <div className="social-link__icon">
                <FaWhatsapp size={20} />
              </div>
              <div className="social-link__content">
                <span className="social-link__eyebrow">WhatsApp Channel</span>
                <span className="social-link__title">Join Our WhatsApp Community</span>
              </div>
              {/* <span className="social-link__cta">Follow Now</span> */}
            </a>

            <a
              href={job.instagramLink || 'https://instagram.com/sample'}
              target="_blank"
              rel="noopener noreferrer"
              className="social-link social-link--instagram"
            >
              <div className="social-link__icon">
                <FaInstagram size={20} />
              </div>
              <div className="social-link__content">
                <span className="social-link__eyebrow">Instagram Updates</span>
                <span className="social-link__title">Follow Our Instagram Channel</span>
              </div>
              {/* <span className="social-link__cta">Follow Now</span> */}
            </a>
          </div>
        </section>

        <section className="important-links">
          <header className="important-links__header">
            <h3 className="important-links__title">Some useful important links</h3>
            <p className="important-links__meta">Quick actions and official resources for this vacancy</p>
          </header>

          <div className="job-actions" role="group" aria-label="Important job actions">
            <a
              className="job-action job-action--primary"
              href={job.applyLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${getActionButtonText(job.category)} - ${job.organization}`}
            >
              <span className="job-action__label">{getActionButtonText(job.category)}</span>
              <span className="job-action__icon" aria-hidden="true">↗</span>
            </a>

            <a
              className="job-action job-action--secondary"
              href={job.organizationLink || job.applyLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="job-action__label">Official Website</span>
              <span className="job-action__icon" aria-hidden="true">↗</span>
            </a>

            <a
              className="job-action job-action--secondary"
              href={job.shortNoticeLink || '#'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="job-action__label">Check Short Notice</span>
              <span className="job-action__icon" aria-hidden="true">↗</span>
            </a>

            <a
              className="job-action job-action--secondary"
              href={job.syllabusLink || '#'}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="job-action__label">Download Syllabus / Notification</span>
              <span className="job-action__icon" aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="important-links__footer">
            <small>
              Always verify details on the official website before applying. (Last date:{' '}
              <span className="job-details__deadline">{formatDate(job.lastDate)}</span>)
            </small>
          </div>
        </section>
      </div>
    </div>
  );
};

export default JobDetails;