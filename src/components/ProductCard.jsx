import { Link } from 'react-router-dom';
import '../styles/products.css';

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={product.image} 
          alt={product.name} 
          className="product-image"
        />
        {product.colors.length > 0 && (
          <div className="product-colors">
            {product.colors.map(color => (
              <span 
                key={color} 
                className="color-dot"
                title={color}
              ></span>
            ))}
          </div>
        )}
      </div>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-category">{product.category}</p>
        <p className="product-price">${product.price}</p>
        {product.sizes && (
          <div className="product-sizes">
            {product.sizes.map(size => (
              <span key={size} className="size-tag">{size}</span>
            ))}
          </div>
        )}
        <button className="view-product">View Details</button>
      </div>
    </div>
  );
}

export default ProductCard;



