import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { jobsAPI } from '../services/api';
import JobCard from '../components/JobCard';
import UpdatesLogin from '../components/UpdatesLogin';
import { FaGraduationCap, FaFileAlt, FaBriefcase, FaArrowRight, FaWhatsapp } from 'react-icons/fa';

const tilePalette = [
  'linear-gradient(135deg, #1F6E8C 0%, #0F2A44 100%)',
  'linear-gradient(135deg, #1B3A4B 0%, #1F6E8C 100%)', 
  'linear-gradient(135deg, #3A7CA5 0%, #1B3A4B 100%)',
  'linear-gradient(135deg, #0F2A44 0%, #3A7CA5 100%)',
  'linear-gradient(135deg, #1F6E8C 0%, #FF9A5A 100%)',
  'linear-gradient(135deg, #1B3A4B 0%, #FFB07C 100%)',
  'linear-gradient(135deg, #3A7CA5 0%, #FF9A5A 100%)',
  'linear-gradient(135deg, #0F2A44 0%, #FFB07C 100%)'
];

const quickCTAs = [
  { icon: <FaGraduationCap size={18} />, label: 'Exam Ready Guides', link: '/category/result' },
  { icon: <FaFileAlt size={18} />, label: 'Instant Admit Cards', link: '/category/admit-card' },
  { icon: <FaBriefcase size={18} />, label: 'Fresh Job Drives', link: '/category/upcoming-job' }
];

const highlightColumnsConfig = [
  {
    id: 'results',
    title: 'Latest Results',
    subtitle: 'Fresh merit lists + score cards',
    headerGradient: 'linear-gradient(120deg, #f43f5e 0%, #ef4444 55%, #dc2626 100%)',
    empty: 'No results available',
    icon: <FaGraduationCap size={22} />,
    viewAllLabel: 'View All Results',
    viewAllLink: '/category/result',
    ctaTint: '#fef2f2',
    ctaColor: '#b91c1c'
  },
  {
    id: 'admitCards',
    title: 'Admit Cards',
    subtitle: 'Instant hall ticket drops',
    headerGradient: 'linear-gradient(120deg, #10b981 0%, #059669 55%, #047857 100%)',
    empty: 'No admit cards available',
    icon: <FaFileAlt size={22} />,
    viewAllLabel: 'View All Admit Cards',
    viewAllLink: '/category/admit-card',
    ctaTint: '#ecfdf5',
    ctaColor: '#047857'
  },
  {
    id: 'upcomingJobs',
    title: 'Job Alerts',
    subtitle: 'Daily hiring + notifications',
    headerGradient: 'linear-gradient(120deg, #f97316 0%, #f97316 45%, #ea580c 100%)',
    empty: 'No jobs available',
    icon: <FaBriefcase size={22} />,
    viewAllLabel: 'View All Jobs',
    viewAllLink: '/category/upcoming-job',
    ctaTint: '#fff7ed',
    ctaColor: '#c2410c'
  }
];

const truncateText = (text = '', limit = 60) => (text.length > limit ? `${text.slice(0, limit)}...` : text);

const Home = () => {
  const [jobs, setJobs] = useState({
    results: [],
    admitCards: [],
    upcomingJobs: [],
    latest: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const [resultsRes, admitCardsRes, upcomingJobsRes, latestRes] = await Promise.all([
        jobsAPI.getAllJobs('result'),
        jobsAPI.getAllJobs('admit-card'),
        jobsAPI.getAllJobs('upcoming-job'),
        jobsAPI.getAllJobs()
      ]);

      console.log('API Response:', { resultsRes, admitCardsRes, upcomingJobsRes, latestRes });
      
      // Handle both response.data and response.data.data formats
      const resultsData = resultsRes.data?.data || resultsRes.data || [];
      const admitCardsData = admitCardsRes.data?.data || admitCardsRes.data || [];
      const upcomingJobsData = upcomingJobsRes.data?.data || upcomingJobsRes.data || [];
      const latestData = latestRes.data?.data || latestRes.data || [];
      
      setJobs({
        results: resultsData.slice(0, 10),
        admitCards: admitCardsData.slice(0, 10),
        upcomingJobs: upcomingJobsData.slice(0, 10),
        latest: latestData.slice(0, 6)
      });
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setJobs({
        results: [],
        admitCards: [],
        upcomingJobs: [],
        latest: []
      });
    } finally {
      setLoading(false);
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

  return (
    <div>
      {/* Top Section */}
      <section style={{
        padding: '3rem 0',
        textAlign: 'center',
        background: 'linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-strong) 45%, var(--color-bg-warm) 100%)',
        borderBottom: '1px solid var(--color-border)'
      }}>
        <div className="container">
          {/* WhatsApp Button */}
          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#25D366',
              color: 'white',
              padding: '12px 28px',
              borderRadius: '999px',
              textDecoration: 'none',
              fontWeight: '600',
              marginBottom: '2rem',
              fontSize: '1.1rem',
              boxShadow: '0 15px 35px rgba(37, 211, 102, 0.35)'
            }}
          >
            <FaWhatsapp size={20} />
            Join WhatsApp
          </a>

          {/* SarkariResult Tools */}
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 2.75rem)',
            fontWeight: '700',
            color: 'var(--text-white)',
            marginBottom: '0.75rem'
          }}>
            SarkariResult Tools
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.125rem)',
            color: 'var(--text-secondary)',
            marginBottom: '2.5rem',
            maxWidth: '600px',
            margin: '0 auto 2.5rem'
          }}>
            Quick access tiles for the most requested job updates, tailor-made for a bright daytime interface.
          </p>

          {/* Dynamic Job Cards Grid */}
          <div className="job-cards-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
            marginBottom: '3rem',
            gridAutoRows: '1fr'
          }}>
            {jobs.latest.map((job, index) => (
              <Link
                key={job._id}
                to={`/job/${job._id}`}
                style={{ textDecoration: 'none', display: 'block', height: '100%' }}
              >
                <div
                  style={{
                    background: tilePalette[index % tilePalette.length],
                    color: '#ffffff',
                    padding: '1.75rem',
                    borderRadius: '20px',
                    textAlign: 'left',
                    fontWeight: '600',
                    fontSize: 'clamp(0.9rem, 2.5vw, 1.05rem)',
                    cursor: 'pointer',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    backdropFilter: 'blur(10px)',
                    textShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                    minHeight: 'clamp(160px, 22vw, 220px)'
                  }}
                  onMouseEnter={(event) => {
                    event.currentTarget.style.transform = 'translateY(-8px) scale(1.05)';
                    event.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.4), 0 0 30px rgba(255, 176, 124, 0.4)';
                  }}
                  onMouseLeave={(event) => {
                    event.currentTarget.style.transform = 'translateY(0) scale(1)';
                    event.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)';
                  }}
                >
                  <div>
                    {job.title.length > 60 ? `${job.title.substring(0, 60)}...` : job.title}
                    <br />
                    <span style={{
                      fontSize: '0.95rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      marginTop: '0.5rem',
                      color: 'rgba(248, 250, 252, 0.8)'
                    }}>
                      <FaArrowRight /> {job.organization}
                      {job.posts && ` • ${job.posts} Posts`}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Quick CTA Row */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1rem'
          }}>
            {quickCTAs.map((cta) => (
              <Link key={cta.label} to={cta.link} className="cta-button">
                {cta.icon}
                <span>{cta.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Three Column Section */}
      <section style={{ padding: '3rem 0', background: 'var(--color-surface)' }}>
        <div className="container">
          <div className="three-column-grid" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {highlightColumnsConfig.map((column) => {
              const columnJobs = jobs[column.id] || [];
              const hasJobs = columnJobs.length > 0;
              return (
                <div key={column.id} className="status-card">
                  <div className="status-card__header" style={{ background: column.headerGradient }}>
                    <div className="status-card__title">
                      <span className="status-card__icon">
                        {column.icon}
                      </span>
                      <div>
                        <p>{column.title}</p>
                        <span className="status-card__subtitle">{column.subtitle}</span>
                      </div>
                    </div>
                    <span className="status-card__count" title={`${columnJobs.length} total`}>{columnJobs.length > 10 ? '10+' : columnJobs.length}</span>
                  </div>

                  <div className={`status-card__body${hasJobs ? '' : ' status-card__body--empty'}`}>
                    {hasJobs ? (
                      <ul className="status-card__list">
                        {columnJobs.slice(0, 10).map((job) => (
                          <li key={job._id}>
                            <Link to={`/job/${job._id}`}>
                              {truncateText(job.title)}
                            </Link>
                            <span>
                              {job.organization || 'Details inside'}
                              {column.id === 'upcomingJobs' && job.posts ? ` - ${job.posts} Posts` : ''}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="status-card__empty">{column.empty}</p>
                    )}
                  </div>

                  <Link
                    to={column.viewAllLink}
                    className="status-card__cta"
                    style={{ background: column.ctaTint, color: column.ctaColor || 'var(--color-text)' }}
                  >
                    {column.viewAllLabel}
                    <FaArrowRight size={16} />
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Updates Login Section */}
      <UpdatesLogin />
    </div>
  );
};

export default Home;