import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import '../styles/optimized-image.css';

function OptimizedImage({ src, alt, className = '', width = 'auto', height = 'auto' }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setError(true);
  }, [src]);

  // Generate a simple color placeholder based on the alt text
  const getColorFromString = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 90%)`;
  };

  const placeholder = getColorFromString(alt);

  if (error) {
    return (
      <div 
        className="optimized-image-error"
        style={{ width, height }}
      >
        <span>Failed to load image</span>
      </div>
    );
  }

  return (
    <div 
      className={`optimized-image-container ${className}`}
      style={{ 
        width,
        height,
        backgroundColor: placeholder
      }}
    >
      <img
        src={src}
        alt={alt}
        className={`optimized-image ${imageLoaded ? 'loaded' : ''}`}
        loading="lazy"
        onLoad={() => setImageLoaded(true)}
        onError={() => setError(true)}
      />
      {!imageLoaded && (
        <div className="loading-placeholder" style={{ backgroundColor: placeholder }} />
      )}
    </div>
  );
}

OptimizedImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

export default OptimizedImage; 