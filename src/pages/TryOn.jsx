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
      // Create a clean filename from the product name
      const cleanProductName = location.state.product.name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
      
      const filename = `wearly-${cleanProductName}.jpg`;

      // Fetch the image
      const response = await fetch(location.state.product.image);
      const blob = await response.blob();
      
      // For mobile devices, create a temporary link with download attribute
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      
      // For iOS Safari compatibility
      if (navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {
        a.target = '_blank';
        a.setAttribute('rel', 'noopener noreferrer');
      }
      
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
      
      setDownloadedProduct(true);
      
      // Show success message for mobile users
      if (/Mobi|Android/i.test(navigator.userAgent)) {
        setError('Image saved! Check your Downloads or Gallery.');
      }
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
              <div className="step-number">STEP 1</div>
              <div className="step-content">
                <h3>Download the Product</h3>
                <p>Click the "Download Product Image" button above to save the garment to your device</p>
                {downloadedProduct && <span className="step-status completed">✓ Completed</span>}
              </div>
            </div>

            <div className="step">
              <div className="step-number">STEP 2</div>
              <div className="step-content">
                <h3>Open Try-On Tool</h3>
                <p>Click the "Open Virtual Try-On" button below to launch the Kolors AI tool</p>
              </div>
            </div>

            <div className="step">
              <div className="step-number">STEP 3</div>
              <div className="step-content">
                <h3>Upload & Process</h3>
                <div className="sub-steps">
                  <div className="sub-step">
                    <span className="sub-step-icon">📸</span>
                    <p>Upload your full-body photo in the "Person image" section</p>
                  </div>
                  <div className="sub-step">
                    <span className="sub-step-icon">👕</span>
                    <p>Upload the downloaded product in the "Garment image" section</p>
                  </div>
                  <div className="sub-step">
                    <span className="sub-step-icon">✨</span>
                    <p>Click "Run" and see the magic happen!</p>
                  </div>
                </div>
              </div>
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
