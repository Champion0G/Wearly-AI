import { useState } from 'react';
import '../styles/tryOn.css';

function TryOn() {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="try-on-page">
      <h1>Virtual Try-On</h1>
      <div className="try-on-container">
        <div className="upload-section">
          <h2>Upload Your Photo</h2>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload}
            className="file-input" 
          />
          <p className="upload-info">
            Supported formats: JPG, PNG. Max size: 5MB
          </p>
        </div>
        
        <div className="preview-section">
          {selectedImage ? (
            <img src={selectedImage} alt="Preview" className="preview-image" />
          ) : (
            <div className="placeholder">
              <i className="fas fa-user"></i>
              <p>Your photo will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TryOn;
