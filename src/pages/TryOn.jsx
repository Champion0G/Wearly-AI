import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/tryon.css';

function TryOn() {
  const location = useLocation();
  const navigate = useNavigate();
  const [downloadedProduct, setDownloadedProduct] = useState(false);
  const [error, setError] = useState(null);

  // Check if we have a product
  if (!location.state?.product) {
    navigate('/');
    return null;
  }

  const downloadProductImage = async () => {
    try {
      const response = await fetch(location.state.product.image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'product.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      setDownloadedProduct(true);
    } catch (err) {
      console.error('Download error:', err);
      setError('Failed to download product image. Please try again.');
    }
  };

  const handleTryOn = () => {
    window.open('https://huggingface.co/spaces/Kwai-Kolors/Kolors-Virtual-Try-On', '_blank');
  };

  return (
    <div className="tryon-page">
      <h1>Virtual Try-On Experience</h1>
      
      <div className="tryon-container">
        <div className="product-section">
          <h2>Selected Product</h2>
          <div className="product-preview">
            <img src={location.state.product.image} alt={location.state.product.name} />
            <h3>{location.state.product.name}</h3>
            <p className="product-price">${location.state.product.price}</p>
          </div>
          <button 
            className="download-button"
            onClick={downloadProductImage}
            disabled={downloadedProduct}
          >
            {downloadedProduct ? '✓ Product Image Downloaded' : 'Download Product Image'}
          </button>
        </div>

        <div className="instructions">
          <h2>How to Try On This Product</h2>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">1</div>
              <p>Download the product image using the button above</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <p>Click "Open Virtual Try-On" to access the Kolors tool</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <p>In the Kolors tool:</p>
              <ul>
                <li>Upload your full-body photo in the "Person image" section</li>
                <li>Upload the downloaded product image in the "Garment image" section</li>
                <li>Click "Run" to see yourself wearing the product!</li>
              </ul>
            </div>
          </div>
        </div>

        <button 
          className="try-on-button"
          onClick={handleTryOn}
        >
          Open Virtual Try-On
        </button>

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TryOn;
