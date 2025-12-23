import { FaYoutube, FaPlay } from 'react-icons/fa';

const YouTubeSection = () => {
  const channelUrl = 'https://www.youtube.com/watch?v=3CkgSQWwNlk'; // Replace with your actual channel URL
  const thumbnailUrl = 'https://i.ytimg.com/vi/T55Kb8rrH1g/hqdefault.jpg?sqp=-oaymwEXCOADEI4CSFryq4qpAwkIARUAAIhCGAE=&rs=AOn4CLDXmIIdZ92kYcdh0KLH0apV0UKG8w'; // Replace with your channel thumbnail

  return (
    <section style={{
      padding: '3.5rem 0',
      background: 'var(--color-surface)',
      border: '1px solid var(--color-border)',
      borderRadius: '20px',
      margin: '2.5rem 0',
      textAlign: 'center',
      boxShadow: 'var(--shadow-soft)'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <FaYoutube size={32} style={{ color: '#ff0000' }} />
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'var(--color-text)',
            margin: 0
          }}>
            YouTube Channel
          </h2>
        </div>
        
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--color-muted)',
          marginBottom: '2rem',
          maxWidth: '600px',
          margin: '0 auto 2rem'
        }}>
          Subscribe to our YouTube channel for video tutorials, exam tips, and latest updates!
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          {/* YouTube Thumbnail */}
          <div style={{
            position: 'relative',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            cursor: 'pointer',
            transition: 'transform 0.3s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          onClick={() => window.open(channelUrl, '_blank')}
          >
            <img 
              src={thumbnailUrl}
              alt="YouTube Channel"
              style={{
                width: '100%',
                height: 'auto',
                display: 'block'
              }}
            />
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              background: 'rgba(255, 0, 0, 0.9)',
              borderRadius: '50%',
              width: '60px',
              height: '60px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}>
              <FaPlay size={24} style={{ color: 'white', marginLeft: '4px' }} />
            </div>
          </div>

          {/* Visit Channel Button */}
          <a
            href={channelUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
            style={{
              fontSize: '1.125rem',
              padding: '12px 32px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'linear-gradient(135deg, #ff0000 0%, #cc0000 100%)',
              textDecoration: 'none'
            }}
          >
            <FaYoutube />
            Visit YouTube Channel
          </a>
        </div>
      </div>
    </section>
  );
};

export default YouTubeSection;