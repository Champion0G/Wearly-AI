import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import '../styles/productDetail.css';
import { useContext } from 'react';
import { CartContext } from '../context/CartContext';

function ProductDetail() {
  const { id } = useParams();
  const location = useLocation();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [mainImage, setMainImage] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setError(null);
      setLoading(true);

      if (location.state?.product) {
        setProduct(location.state.product);
        setLoading(false);
        return;
      }

      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY,
          'X-RapidAPI-Host': import.meta.env.VITE_RAPID_API_HOST
        }
      };

      try {
        const response = await fetch(
          `https://apidojo-hm-hennes-mauritz-v1.p.rapidapi.com/products/detail?lang=en&country=us&productcode=${id}`,
          options
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Product Detail API Response:', data);

        if (!data || !data.product) {
          throw new Error('Invalid product data received from API');
        }

        const imageUrls = data.product.articlesList?.[0]?.galleryDetails?.map(img => img.url) || 
                         [data.product.articlesList?.[0]?.normalPicture?.[0]?.url] ||
                         ['https://via.placeholder.com/500x600?text=No+Image'];
        
        setProduct({
          id: data.product.code || id,
          name: data.product.name || 'Product Name',
          price: data.product.whitePrice?.price || 0,
          images: imageUrls,
          description: data.product.description || 'No description available',
          sizes: data.product.variantSizes || [],
          category: data.product.categoryName || 'Uncategorized',
          details: data.product.materialDetails || [],
          care: data.product.careInstructions || []
        });
      } catch (err) {
        console.error('Error:', err);
        setError(err.message || 'Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, location]);

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes?.length > 0) {
      alert('Please select a size');
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      size: selectedSize,
      quantity: 1
    });

    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 3000);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Try Again</button>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="error-container">
        <h2>Product Not Found</h2>
        <p>Sorry, we couldn't find the product you're looking for.</p>
        <button onClick={() => window.history.back()}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">
        <div className="product-gallery">
          <div className="main-image-container">
            <img 
              src={product.images[mainImage]} 
              alt={product.name}
              className="main-product-image"
            />
          </div>
          <div className="thumbnail-container">
            {product.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${product.name} view ${index + 1}`}
                className={`thumbnail ${mainImage === index ? 'active' : ''}`}
                onClick={() => setMainImage(index)}
              />
            ))}
          </div>
        </div>

        <div className="product-info">
          <div className="product-header">
            <h1>{product.name}</h1>
            <p className="category">{product.category}</p>
            <p className="price">${product.price}</p>
          </div>

          <div className="virtual-try-on-banner">
            <div className="try-on-icon">
              <i className="fas fa-camera"></i>
            </div>
            <div className="try-on-info">
              <h3>Virtual Try-On Available!</h3>
              <p>See how this looks on you using our AR technology</p>
            </div>
            <button className="try-on-button" onClick={() => window.location.href='/try-on'}>
              Try It On
            </button>
          </div>

          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>

          {product.sizes && product.sizes.length > 0 && (
            <div className="size-selection">
              <h3>Select Size</h3>
              <div className="size-options">
                {product.sizes.map((size) => (
                  <button
                    key={size.name}
                    className={`size-btn ${selectedSize === size.name ? 'active' : ''} ${size.availability !== 'in_stock' ? 'out-of-stock' : ''}`}
                    onClick={() => setSelectedSize(size.name)}
                    disabled={size.availability !== 'in_stock'}
                  >
                    {size.name}
                    {size.availability !== 'in_stock' && <span className="out-of-stock-label">Out of Stock</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="product-actions">
            <button 
              className={`add-to-cart-btn ${addedToCart ? 'added' : ''}`}
              onClick={handleAddToCart}
              disabled={product.sizes?.length > 0 && !selectedSize}
            >
              {addedToCart ? 'Added to Cart ✓' : 'Add to Cart'}
            </button>
            <button className="try-on-btn">
              <i className="fas fa-camera"></i>
              Virtual Try-On
            </button>
          </div>

          {(product.details.length > 0 || product.care.length > 0) && (
            <div className="product-additional-info">
              {product.details.length > 0 && (
                <div className="product-details">
                  <h3>Product Details</h3>
                  <ul>
                    {product.details.map((detail, index) => (
                      <li key={index}>{detail}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {product.care.length > 0 && (
                <div className="care-instructions">
                  <h3>Care Instructions</h3>
                  <ul>
                    {product.care.map((instruction, index) => (
                      <li key={index}>{instruction}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
