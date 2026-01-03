import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import { FaArrowLeft, FaCalendarAlt, FaBuilding, FaExternalLinkAlt, FaEye } from 'react-icons/fa';
import '../category-mobile.css';
import '../category-theme.css';
import '../category-complete-theme.css';

// Custom hook for responsive design and theme detection
const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isSmallMobile, setIsSmallMobile] = useState(window.innerWidth <= 480);
  const [isDarkTheme, setIsDarkTheme] = useState(document.body.classList.contains('dark-theme'));

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      setIsSmallMobile(window.innerWidth <= 480);
    };

    const handleThemeChange = () => {
      setIsDarkTheme(document.body.classList.contains('dark-theme'));
    };

    window.addEventListener('resize', handleResize);
    
    // Listen for theme changes
    const observer = new MutationObserver(handleThemeChange);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      observer.disconnect();
    };
  }, []);

  return { isMobile, isSmallMobile, isDarkTheme };
};

const CategoryPage = () => {
  const { category } = useParams();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isMobile, isSmallMobile, isDarkTheme } = useResponsive();

  // Simplified theme colors using CSS variables
  const themeColors = {
    text: 'var(--category-primary-text)',
    textMuted: 'var(--category-secondary-text)',
    textSecondary: 'var(--category-muted-text)',
    background: 'var(--category-bg)',
    border: 'var(--category-border)',
    headerBg: 'var(--category-surface)',
    hoverBg: 'var(--category-hover)'
  };

  useEffect(() => {
    fetchJobs();
  }, [category]);

  const fetchJobs = async () => {
    try {
      const response = await jobsAPI.getAllJobs(category);
      // Handle both response.data and response.data.data formats
      const jobsData = response.data?.data || response.data || [];
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryTitle = (value) => {
    switch (value) {
      case 'result':
        return 'Results';
      case 'admit-card':
        return 'Admit Cards';
      case 'upcoming-job':
        return 'Upcoming Jobs';
      case 'scholarship':
        return 'Scholarships';
      case 'admission':
        return 'Admissions';
      default:
        return 'Jobs';
    }
  };

  const getCategoryBackground = (value) => {
    switch (value) {
      case 'result':
        return 'linear-gradient(135deg, #ecfdf5 0%, #f0fdfa 100%)';
      case 'admit-card':
        return 'linear-gradient(135deg, #e0f2ff 0%, #f5fbff 100%)';
      case 'upcoming-job':
        return 'linear-gradient(135deg, #fff5f1 0%, #fff9f4 100%)';
      case 'scholarship':
        return 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)';
      case 'admission':
        return 'linear-gradient(135deg, #ecfeff 0%, #cffafe 100%)';
      default:
        return 'linear-gradient(135deg, #f1f5f9 0%, #ffffff 100%)';
    }
  };

  if (loading) {
    return (
      <section style={{
        background: isDarkTheme ? 'var(--color-surface)' : getCategoryBackground(category),
        color: themeColors.text,
        padding: '3rem 0',
        borderBottom: `1px solid ${themeColors.border}`
      }}>
        <div className="container" style={{
          minHeight: '280px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.125rem',
          color: themeColors.text
        }}>
          Loading category jobs...
        </div>
      </section>
    );
  }

  return (
    <div className="category-page">
      <section className="category-header-section" style={{
        background: isDarkTheme ? 'var(--color-surface)' : getCategoryBackground(category),
        color: themeColors.text,
        padding: '3rem 0',
        borderBottom: `1px solid ${themeColors.border}`
      }}>
        <div className="container">
          <Link to="/" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#000000',
            textDecoration: 'none',
            marginBottom: '2rem',
            fontWeight: '600',
            opacity: 0.8
          }}>
            <FaArrowLeft />
            Back to Home
          </Link>

          <h1 style={{
            fontSize: 'clamp(2rem, 6vw, 3rem)',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: themeColors.text
          }}>
            {getCategoryTitle(category)}
          </h1>
          
          <p style={{
            fontSize: '1.25rem',
            opacity: 0.9,
            color: themeColors.textMuted
          }}>
            {jobs.length} {jobs.length === 1 ? 'notification' : 'notifications'} available
          </p>
        </div>
      </section>

      {/* Jobs Section - List Format */}
      <section style={{ padding: 'clamp(2rem, 5vw, 3rem) 0' }}>
        <div className="container">
          {jobs.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '4rem 0'
            }}>
              <h2 style={{
                fontSize: '1.5rem',
                color: themeColors.textMuted,
                marginBottom: '1rem'
              }}>
                No {getCategoryTitle(category).toLowerCase()} available at the moment
              </h2>
              <p style={{
                color: themeColors.textMuted,
                marginBottom: '2rem',
                opacity: 0.9
              }}>
                Please check back later for updates
              </p>
              <Link to="/" className="btn btn-primary">
                Go Back Home
              </Link>
            </div>
          ) : (
            <div style={{
              background: themeColors.background,
              borderRadius: '12px',
              boxShadow: isDarkTheme ? '0 4px 20px rgba(0, 0, 0, 0.4)' : '0 4px 20px rgba(0, 0, 0, 0.08)',
              overflow: 'hidden',
              border: `1px solid ${themeColors.border}`
            }}>
              {/* List Header - Hidden on mobile */}
              <div className="category-list-header" style={{
                background: themeColors.headerBg,
                padding: '1rem 1.5rem',
                borderBottom: `1px solid ${themeColors.border}`,
                display: isMobile ? 'none' : 'grid',
                gridTemplateColumns: '1fr auto auto',
                gap: '1rem',
                alignItems: 'center',
                fontWeight: '600',
                fontSize: '0.9rem',
                color: themeColors.textSecondary
              }}>
                <div>Job Title & Organization</div>
                <div style={{ textAlign: 'center', minWidth: '120px' }}>Date</div>
                <div style={{ textAlign: 'center', minWidth: '100px' }}>Action</div>
              </div>

              {/* List Items */}
              <div>
                {jobs.map((job, index) => {
                  const formatDate = (date) => {
                    return new Date(date).toLocaleDateString('en-IN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    });
                  };

                  const getCategoryColor = (category) => {
                    switch (category) {
                      case 'result':
                        return '#059669';
                      case 'admit-card':
                        return '#2563eb';
                      case 'upcoming-job':
                        return '#dc2626';
                      case 'scholarship':
                        return '#7c3aed';
                      case 'admission':
                        return '#0891b2';
                      default:
                        return '#6b7280';
                    }
                  };

                  const getCategoryLabel = (category) => {
                    switch (category) {
                      case 'result':
                        return 'Result';
                      case 'admit-card':
                        return 'Admit Card';
                      case 'upcoming-job':
                        return 'Job';
                      case 'scholarship':
                        return 'Scholarship';
                      case 'admission':
                        return 'Admission';
                      default:
                        return category;
                    }
                  };

                  const getActionButton = (category) => {
                    switch (category) {
                      case 'result':
                        return { text: 'Check Result', icon: FaExternalLinkAlt };
                      case 'admit-card':
                        return { text: 'Download', icon: FaExternalLinkAlt };
                      case 'upcoming-job':
                        return { text: 'Apply Now', icon: FaExternalLinkAlt };
                      case 'scholarship':
                        return { text: 'Apply Now', icon: FaExternalLinkAlt };
                      case 'admission':
                        return { text: 'Apply Now', icon: FaExternalLinkAlt };
                      default:
                        return { text: 'View Details', icon: FaEye };
                    }
                  };

                  return (
                    <div
                      key={job._id}
                      className="category-list-item"
                      style={{
                        padding: isMobile ? '1rem' : '1.25rem 1.5rem',
                        borderBottom: index < jobs.length - 1 ? `1px solid ${themeColors.border}` : 'none',
                        display: isMobile ? 'block' : 'grid',
                        gridTemplateColumns: isMobile ? 'none' : '1fr auto auto',
                        gap: '1rem',
                        alignItems: 'center',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = themeColors.hoverBg;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      {/* Job Title & Organization */}
                      <div className="category-list-mobile-content" style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: isMobile ? '0.75rem' : '0.5rem'
                      }}>
                        <h3 style={{
                          fontSize: isSmallMobile ? '1rem' : isMobile ? '1.05rem' : '1.1rem',
                          fontWeight: '600',
                          marginBottom: isMobile ? '0.25rem' : '0.5rem',
                          color: themeColors.text,
                          lineHeight: '1.4'
                        }}>
                          {job.title}
                        </h3>
                        <div className="category-list-mobile-meta" style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          color: themeColors.textSecondary,
                          fontSize: isSmallMobile ? '0.8rem' : '0.9rem',
                          flexWrap: 'wrap',
                          justifyContent: isMobile ? 'space-between' : 'flex-start'
                        }}>
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            flex: isMobile ? '1' : 'auto'
                          }}>
                            <FaBuilding size={14} />
                            <span>{job.organization}</span>
                            {job.category === 'upcoming-job' && job.posts && (
                              <span className="category-posts-badge" style={{
                                background: '#dcfce7',
                                color: '#166534',
                                padding: '2px 8px',
                                borderRadius: '12px',
                                fontSize: isSmallMobile ? '0.7rem' : '0.8rem',
                                fontWeight: '500',
                                marginLeft: '0.5rem'
                              }}>
                                {job.posts} Posts
                              </span>
                            )}
                          </div>
                          
                          {/* Mobile: Date and Action in same row */}
                          {isMobile && (
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '1rem',
                              marginTop: '0.5rem',
                              width: '100%'
                            }}>
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                color: themeColors.textSecondary,
                                fontSize: isSmallMobile ? '0.8rem' : '0.9rem'
                              }}>
                                <FaCalendarAlt size={14} />
                                <span>{formatDate(job.lastDate)}</span>
                              </div>
                              
                              <Link
                                to={`/job/${job._id}`}
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                  color: '#ffffff',
                                  padding: isSmallMobile ? '6px 12px' : '8px 16px',
                                  borderRadius: '8px',
                                  textDecoration: 'none',
                                  fontSize: isSmallMobile ? '0.75rem' : '0.85rem',
                                  fontWeight: '500',
                                  transition: 'all 0.2s ease',
                                  whiteSpace: 'nowrap',
                                  flexShrink: 0
                                }}
                                onMouseEnter={(e) => {
                                  e.target.style.transform = 'translateY(-2px)';
                                  e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
                                }}
                                onMouseLeave={(e) => {
                                  e.target.style.transform = 'translateY(0)';
                                  e.target.style.boxShadow = 'none';
                                }}
                              >
                                {getActionButton(job.category).text}
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Desktop: Date and Action Button */}
                      {!isMobile && (
                        <>
                          {/* Date */}
                          <div style={{
                            textAlign: 'center',
                            minWidth: '120px'
                          }}>
                            <div style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '0.5rem',
                              color: themeColors.textSecondary,
                              fontSize: '0.9rem'
                            }}>
                              <FaCalendarAlt size={14} />
                              <span>{formatDate(job.lastDate)}</span>
                            </div>
                          </div>

                          {/* Action Button */}
                          <div style={{
                            textAlign: 'center',
                            minWidth: '100px'
                          }}>
                            <Link
                              to={`/job/${job._id}`}
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                                color: '#ffffff',
                                padding: '8px 16px',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                fontSize: '0.85rem',
                                fontWeight: '500',
                                transition: 'all 0.2s ease',
                                whiteSpace: 'nowrap'
                              }}
                              onMouseEnter={(e) => {
                                e.target.style.transform = 'translateY(-2px)';
                                e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.3)';
                              }}
                              onMouseLeave={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = 'none';
                              }}
                            >
                              {getActionButton(job.category).text}
                            </Link>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;