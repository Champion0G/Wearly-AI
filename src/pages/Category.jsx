import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/category.css';

function Category() {
  const { categoryCode } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': import.meta.env.VITE_RAPID_API_KEY,
          'X-RapidAPI-Host': import.meta.env.VITE_RAPID_API_HOST
        }
      };

      try {
        setLoading(true);
        const response = await fetch(
          `https://apidojo-hm-hennes-mauritz-v1.p.rapidapi.com/products/list?country=us&lang=en&currentpage=0&pagesize=30&categories=${categoryCode}`,
          options
        );
        
        if (!response.ok) throw new Error('Failed to fetch products');
        
        const data = await response.json();
        console.log('Category API Response:', data);
        
        if (data.results && data.results.length > 0) {
          const transformedProducts = data.results.map(product => {
            // Extract sizes from the API response
            const sizes = product.variantSizes?.map(size => ({
              name: size.filterCode || size.name,
              availability: size.availability || 'in_stock'
            })) || [];

            return {
              id: product.defaultArticle?.code || product.code,
              name: product.name,
              price: product.price?.value || 0,
              image: product.galleryImages?.[0]?.url || 
                     product.images?.[0]?.url ||
                     'https://via.placeholder.com/300x400?text=No+Image',
              category: product.categoryName,
              description: product.description || 'No description available',
              sizes: sizes
            };
          });
          setProducts(transformedProducts);
        }
      } catch (err) {
        console.error('Category Error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (categoryCode) {
      fetchCategoryProducts();
    }
  }, [categoryCode]);

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, {
      state: {
        product: {
          ...product,
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
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  return (
    <div className="category-page">
      <div className="category-header">
        <h1>{categoryCode?.replace(/_/g, ' ').toUpperCase()}</h1>
      </div>
      <div className="products-grid">
        {products.map(product => (
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
              <p className="price">${product.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Category;
