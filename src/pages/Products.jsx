import { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/products.css';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const fetchProducts = async () => {
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '79f78136ffmsh2587f6e96e44266p1dddc5jsne1f773947bac', // Replace with your key
        'X-RapidAPI-Host': 'apidojo-hm-hennes-mauritz-v1.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch('https://apidojo-hm-hennes-mauritz-v1.p.rapidapi.com/products/list?country=us&lang=en&currentpage=0&pagesize=30&categories=men_all&concepts=H%26M%20MAN', options);
      const data = await response.json();
      
      // Transform the H&M data structure to match our needs
      const transformedProducts = data.results.map(product => ({
        id: product.defaultArticle.code,
        name: product.name,
        price: product.price.value,
        image: product.images[0].url,
        category: product.categoryName,
        description: product.description,
        colors: product.articleColorNames,
        galleryImages: product.galleryImages,
        sizes: product.variantSizes
      }));

      setProducts(transformedProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching products:', error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '79f78136ffmsh2587f6e96e44266p1dddc5jsne1f773947bac', // Replace with your key
        'X-RapidAPI-Host': 'apidojo-hm-hennes-mauritz-v1.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch('https://apidojo-hm-hennes-mauritz-v1.p.rapidapi.com/categories/list?lang=en&country=us', options);
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleCategoryChange = async (categoryId) => {
    setSelectedCategory(categoryId);
    setLoading(true);
    
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '79f78136ffmsh2587f6e96e44266p1dddc5jsne1f773947bac', // Replace with your key
        'X-RapidAPI-Host': 'apidojo-hm-hennes-mauritz-v1.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(`https://apidojo-hm-hennes-mauritz-v1.p.rapidapi.com/products/list?country=us&lang=en&currentpage=0&pagesize=30&categories=${categoryId}`, options);
      const data = await response.json();
      
      const transformedProducts = data.results.map(product => ({
        id: product.defaultArticle.code,
        name: product.name,
        price: product.price.value,
        image: product.images[0].url,
        category: product.categoryName,
        description: product.description,
        colors: product.articleColorNames,
        galleryImages: product.galleryImages,
        sizes: product.variantSizes
      }));

      setProducts(transformedProducts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching category products:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="products-loading">
        <div className="loading-spinner"></div>
        <p>Loading latest fashion...</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>H&M Collection</h1>
        <div className="filters">
          <select 
            className="filter-select" 
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.categoryCode} value={category.categoryCode}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="products-grid">
        {products.map(product => (
          <ProductCard 
            key={product.id} 
            product={product}
          />
        ))}
      </div>
    </div>
  );
}

export default Products;
  
  
  