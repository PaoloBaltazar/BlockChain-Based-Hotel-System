import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import './CustomerPage.css'; // Add custom CSS here for styling
import hero from '../assets/hero-image.jpg';

const CustomerPage = () => {
  return (
    <div className="customer-page">
      {/* Hero Section */}
      <div className="hero-section">
        <img 
          src={hero}
          alt="Hero accommodation" // Add meaningful alt text
          className="hero-image" 
        />
        <div className="hero-text">
          <h3>Welcome, Valued Customer!</h3>
          <h1>Accommodation</h1>
        </div>
      </div>

      <div className="room-categories-section">
        <div className="room-heading">
          <h1>Explore Our Rooms</h1>
          <p>Discover our wide range of rooms and make your booking today.</p>
        </div>
        <div className="room-category-cards">
          <Link to="/rooms" className="room-category-card">
            <h3 className="category-text">View All Rooms</h3>
            <p className="category-description">Browse through all available rooms and find the one that suits you best.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
