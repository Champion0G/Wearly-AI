import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/navbar.css';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const { cartCount } = useContext(CartContext);

  const categories = [
    { name: "Men's Fashion", code: 'men_all' },
    { name: "Women's Fashion", code: 'ladies_all' },
    { name: 'Divided', code: 'divided_all' },
    { name: 'Kids', code: 'kids_all' },
    { name: 'Sport', code: 'sportswear_all' },
    { name: 'Accessories', code: 'accessories' }
  ];

  const handleCategoryClick = (categoryCode) => {
    navigate(`/category/${categoryCode}`);
    setIsCategoryOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="nav-left">
          <button 
            className="hamburger-menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <i className="fas fa-bars"></i>
          </button>
          <Link to="/" className="brand">WEARLY</Link>
        </div>

        <div className="nav-right">
          <div className="user-dropdown">
            <button 
              className="user-icon-btn"
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
            >
              <i className="fas fa-user"></i>
            </button>
            
            {isUserDropdownOpen && (
              <div className="user-dropdown-content">
                <Link to="/login" className="dropdown-item">Login</Link>
                <Link to="/signup" className="dropdown-item">Sign Up</Link>
              </div>
            )}
          </div>
          
          <Link to="/cart" className="cart-icon">
            <i className="fas fa-shopping-cart"></i>
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </Link>
        </div>
      </div>

      {/* Sidebar Menu */}
      <div className={`sidebar-menu ${isMenuOpen ? 'active' : ''}`}>
        <div className="sidebar-header">
          <h3>Menu</h3>
          <button className="close-menu" onClick={() => setIsMenuOpen(false)}>×</button>
        </div>
        <div className="sidebar-content">
          <Link to="/" onClick={() => setIsMenuOpen(false)}>Home</Link>
          <div className="sidebar-categories">
            <h4>Categories</h4>
            {categories.map(category => (
              <Link 
                key={category.code}
                to={`/category/${category.code}`}
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
