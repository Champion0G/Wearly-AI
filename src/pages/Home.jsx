import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/home.css';

// Cache object to store the products data
const cache = {
  products: null,
  timestamp: null,
  CACHE_DURATION: 5 * 60 * 1000 // 5 minutes in milliseconds
};

function Home() {
  const [products, setProducts] = useState(cache.products || []);
  const [loading, setLoading] = useState(!cache.products);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      // Debug: Log environment variables
      console.log('API Key:', import.meta.env.VITE_RAPID_API_KEY);
      console.log('API Host:', import.meta.env.VITE_RAPID_API_HOST);

      // Check if we have valid cached data
      if (
        cache.products && 
        cache.timestamp && 
        Date.now() - cache.timestamp < cache.CACHE_DURATION
      ) {
        setProducts(cache.products);
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
        console.log('Fetching with options:', options);
        const response = await fetch('https://apidojo-hm-hennes-mauritz-v1.p.rapidapi.com/products/list?country=us&lang=en&currentpage=0&pagesize=30&categories=men_all&concepts=H%26M%20MAN', options);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('API Response:', data);

        if (data.results && data.results.length > 0) {
          const transformedProducts = data.results.map(product => {
            const sizes = product.variantSizes?.map(size => ({
              name: size.filterCode || size.name,
              availability: size.availability || 'in_stock'
            })) || [];

            return {
              id: product.defaultArticle?.code || product.code,
              name: product.name,
              price: product.price?.value || 0,
              image: product.articles?.[0]?.images?.[0]?.url || 
                     product.galleryImages?.[0]?.url || 
                     product.images?.[0]?.url ||
                     'https://via.placeholder.com/300x400?text=No+Image',
              category: product.categoryName,
              description: product.description || '',
              sizes: sizes
            };
          });

          // Update the cache
          cache.products = transformedProducts;
          cache.timestamp = Date.now();
          
          setProducts(transformedProducts);
        } else {
          throw new Error('No products found in the response');
        }
      } catch (err) {
        console.error('Error details:', err);
        setError(err.message);
        
        // If we have cached data, use it as fallback
        if (cache.products) {
          setProducts(cache.products);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, {
      state: {
        product: {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          description: product.description || 'No description available',
          category: product.category,
          sizes: product.sizes || [],
          images: [product.image],
          details: [],
          care: []
        }
      }
    });
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loader"></div>
        <p>Loading amazing products...</p>
      </div>
    );
  }

  if (error && !products.length) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="home">
      <div className="hero-section">
        <h1>Welcome to WEARLY</h1>
        <p className="tagline">Buy before you try</p>
      </div>

      <div className="products-section">
        <h2>Featured Products</h2>
        {error && <div className="error-banner">Unable to refresh products. Showing cached data.</div>}
        <div className="products-grid">
          {products.map((product) => (
            <div 
              key={product.id} 
              className="product-card"
              onClick={() => handleProductClick(product)}
            >
              <div className="product-image">
                <img 
                  src={product.image} 
                  alt={product.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300x400?text=No+Image';
                  }}
                />
                <div className="hover-overlay">
                  <button className="view-button">
                    View Details
                  </button>
                </div>
              </div>
              <div className="product-details">
                <h3>{product.name}</h3>
                <p className="category">{product.category}</p>
                <p className="price">${product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
