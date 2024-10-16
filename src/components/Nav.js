import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation
import { ethers } from 'ethers';
import icon from '../assets/metamask-icon.png';
import './Nav.css';

const Nav = ({ userAddress, provider, isManager }) => {
  const [balance, setBalance] = useState('');

  // Fetch the balance when the provider or userAddress changes
  useEffect(() => {
    const getBalance = async () => {
      if (provider && userAddress) {
        const balance = await provider.getBalance(userAddress);
        const ethBalance = ethers.formatEther(balance); // Convert balance to ETH
        setBalance(parseFloat(ethBalance).toFixed(4)); // Show 4 decimal places
      }
    };

    getBalance();
  }, [provider, userAddress]);

  return (
    <div className="nav-container">
      <nav className="navbar">
        <div className="nav-left-section">
          <div className="logo-container">
            <h3>Hotel DApp</h3>
          </div>

          <div className="nav-links">
            {isManager ? (
              // Show Dashboard link for manager
              <>
                <Link to="/manager">Dashboard</Link>
              </>
            ) : (
              // Show Home and Bookings (Pending Booking changed to My Bookings) for customer
              <>
                <Link to="/">Home</Link>
                <Link to="/my-bookings">My Bookings</Link>
              </>
            )}
          </div>
        </div>

        <div className="user-info">
          <div className="user-avatar">
            <span className="user-address">0x{userAddress.slice(2, 6)}...{userAddress.slice(-4)}</span>
            <p className="eth-balance">{balance} ETH</p>
          </div>
          
          <img className="metamask-icon" src={icon} alt="Metamask Icon" />
        </div>
      </nav>
    </div>
  );
};

export default Nav;
