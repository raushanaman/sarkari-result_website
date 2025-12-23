import { Link } from 'react-router-dom';
import { FaCalendarAlt, FaBuilding, FaExternalLinkAlt } from 'react-icons/fa';

const JobCard = ({ job }) => {
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
        return 'Job Opening';
      default:
        return category;
    }
  };

  const getActionButton = (category) => {
    switch (category) {
      case 'result':
        return { text: 'Check Result', icon: FaExternalLinkAlt };
      case 'admit-card':
        return { text: 'Download Admit Card', icon: FaExternalLinkAlt };
      case 'upcoming-job':
        return { text: 'Apply Now', icon: FaExternalLinkAlt };
      default:
        return { text: 'View Details', icon: FaExternalLinkAlt };
    }
  };

  return (
    <div className="card card-rich" style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        top: '16px',
        right: '16px',
        background: getCategoryColor(job.category),
        color: '#ffffff',
        padding: '4px 12px',
        borderRadius: '20px',
        fontSize: '0.75rem',
        fontWeight: '500'
      }}>
        {getCategoryLabel(job.category)}
      </div>

      <h3 style={{
        fontSize: '1.25rem',
        fontWeight: '600',
        marginBottom: '0.75rem',
        paddingRight: '100px',
        lineHeight: '1.4',
        color: 'inherit'
      }}>
        {job.title}
      </h3>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.75rem',
        color: 'inherit',
        opacity: 0.7
      }}>
        <FaBuilding />
        <span>{job.organization}</span>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1rem',
        color: 'inherit',
        opacity: 0.7
      }}>
        <FaCalendarAlt />
        <span>
          {job.category === 'result' || job.category === 'admit-card' ? 'Post Date' : 'Last Date'}: {formatDate(job.lastDate)}
        </span>
      </div>

      <p style={{
        color: 'inherit',
        opacity: 0.7,
        marginBottom: '1.5rem',
        lineHeight: '1.5',
        display: '-webkit-box',
        WebkitLineClamp: 3,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {job.description}
      </p>

      <div style={{
        display: 'flex',
        gap: '0.75rem',
        alignItems: 'center'
      }}>
        <Link
          to={`/job/${job._id}`}
          className="btn btn-primary"
          style={{
            fontSize: '0.875rem',
            padding: '8px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          {getActionButton(job.category).text}
          <FaExternalLinkAlt size={12} />
        </Link>

        {job.category === 'upcoming-job' && job.posts && (
          <span style={{
            fontSize: '0.875rem',
            color: '#4ade80',
            fontWeight: '500'
          }}>
            Posts: {job.posts}
          </span>
        )}
      </div>
    </div>
  );
};

export default JobCard;