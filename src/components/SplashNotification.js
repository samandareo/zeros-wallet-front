import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function SplashNotification({ data, onComplete }) {
  const [secondsLeft, setSecondsLeft] = useState(data.duration_seconds || 3);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Only start timer after image is loaded
    if (!imageLoaded) return;

    if (secondsLeft <= 0) {
      onComplete();
      return;
    }
    const timer = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, onComplete, imageLoaded]);

  const handleClick = () => {
    window.location.href = data.redirect_url;
    onComplete();
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div className="splash-overlay" style={styles.fullscreen}>
      <div className="splash-content" style={styles.content}>
        <img 
          src={data.image_url} 
          alt="Splash notification"
          onClick={handleClick} 
          onLoad={handleImageLoad}
          style={styles.image} 
        />
        {imageLoaded && (
          <button 
            onClick={onComplete} 
            className="btn-skip"
            style={styles.skip}
          >
            Skip ({secondsLeft}s)
          </button>
        )}
      </div>
    </div>
  );
}

const styles = {
  fullscreen: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999
  },
  content: {
    position: 'relative',
    maxWidth: '500px',
    width: '100%',
    margin: '0 20px'
  },
  image: {
    width: '100%',
    height: '100vh',
    borderRadius: '12px',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    objectFit: 'cover'
  },
  skip: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: '8px 16px',
    borderRadius: '20px',
    border: 'none',
    backgroundColor: 'rgba(255,255,255,0.9)',
    color: '#004c94',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }
};

SplashNotification.propTypes = {
  data: PropTypes.shape({
    image_url: PropTypes.string.isRequired,
    redirect_url: PropTypes.string.isRequired,
    duration_seconds: PropTypes.number
  }).isRequired,
  onComplete: PropTypes.func.isRequired
};

export default SplashNotification;