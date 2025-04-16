import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/home.css';

// Cache configuration
const CACHE_CONFIG = {
  CACHE_KEY: 'wearly_products_cache',
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes in milliseconds
  MAX_CACHE_SIZE: 10 * 1024 * 1024, // 10MB max cache size
};

// Cache utility functions
const cacheUtils = {
  getCache: () => {
    try {
      const cachedData = localStorage.getItem(CACHE_CONFIG.CACHE_KEY);
      if (!cachedData) return null;
      
      const { data, timestamp } = JSON.parse(cachedData);
      const isExpired = Date.now() - timestamp > CACHE_CONFIG.CACHE_DURATION;
      
      if (isExpired) {
        localStorage.removeItem(CACHE_CONFIG.CACHE_KEY);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error reading cache:', error);
      return null;
    }
  },

  setCache: (data) => {
    try {
      const cacheData = {
        data,
        timestamp: Date.now(),
      };
      
      const cacheSize = JSON.stringify(cacheData).length;
      if (cacheSize > CACHE_CONFIG.MAX_CACHE_SIZE) {
        console.warn('Cache size exceeds limit, clearing cache');
        localStorage.removeItem(CACHE_CONFIG.CACHE_KEY);
        return;
      }
      
      localStorage.setItem(CACHE_CONFIG.CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Error writing to cache:', error);
    }
  },

  clearCache: () => {
    try {
      localStorage.removeItem(CACHE_CONFIG.CACHE_KEY);
    } catch (error) {
      console.error('Error clearing cache:', error);
    }
  }
};

// Fallback products for when API fails
const fallbackProducts = [
  {
    id: '1001',
    name: 'Classic Cotton T-Shirt',
    price: 19.99,
    image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    category: 'T-Shirts',
    description: 'A comfortable cotton t-shirt perfect for everyday wear.',
    sizes: [{name: 'S', availability: 'in_stock'}, {name: 'M', availability: 'in_stock'}, {name: 'L', availability: 'in_stock'}]
  },
  {
    id: '1002',
    name: 'Slim Fit Jeans',
    price: 39.99,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    category: 'Jeans',
    description: 'Modern slim fit jeans with a stylish wash.',
    sizes: [{name: '30', availability: 'in_stock'}, {name: '32', availability: 'in_stock'}, {name: '34', availability: 'in_stock'}]
  },
  {
    id: '1003',
    name: 'Casual Hoodie',
    price: 44.99,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80',
    category: 'Hoodies',
    description: 'A warm and cozy hoodie perfect for chilly days.',
    sizes: [{name: 'S', availability: 'in_stock'}, {name: 'M', availability: 'in_stock'}, {name: 'L', availability: 'in_stock'}, {name: 'XL', availability: 'in_stock'}]
  }
];

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const navigate = useNavigate();

  const fetchProducts = useCallback(async (pageNum) => {
    // Try to get data from cache first
    const cachedProducts = cacheUtils.getCache();
    if (cachedProducts && pageNum === 0) {
      setProducts(cachedProducts);
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
        `https://apidojo-hm-hennes-mauritz-v1.p.rapidapi.com/products/list?country=us&lang=en&currentpage=${pageNum}&pagesize=12&categories=men_all&concepts=H%26M%20MAN`,
        options
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const transformedProducts = data.results.map(product => ({
          id: product.defaultArticle?.code || product.code,
          name: product.name,
          price: product.price?.value || 0,
          image: product.articles?.[0]?.images?.[0]?.url || 
                 product.galleryImages?.[0]?.url || 
                 product.images?.[0]?.url ||
                 'https://via.placeholder.com/300x400?text=No+Image',
          category: product.categoryName,
          description: product.description || '',
          sizes: product.variantSizes?.map(size => ({
            name: size.filterCode || size.name,
            availability: size.availability || 'in_stock'
          })) || []
        }));

        if (pageNum === 0) {
          cacheUtils.setCache(transformedProducts);
          setProducts(transformedProducts);
        } else {
          setProducts(prev => [...prev, ...transformedProducts]);
        }
        setHasMore(data.results.length === 12);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError(err.message);
      
      if (pageNum === 0) {
        const cachedProducts = cacheUtils.getCache();
        if (cachedProducts) {
          setProducts(cachedProducts);
        } else {
          setProducts(fallbackProducts);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts(page);
  }, [page, fetchProducts]);

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, {
      state: { product }
    });
  };

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight &&
      !loading &&
      hasMore
    ) {
      setPage(prev => prev + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  if (loading && products.length === 0) {
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
                  loading="lazy"
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
        {loading && products.length > 0 && (
          <div className="loading-more">
            <div className="loader"></div>
            <p>Loading more products...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
