import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import icon from '../assets/metamask-icon.png';
import './Nav.css';

const Nav = ({ userAddress, provider, isManager }) => {
  const [balance, setBalance] = useState('');

  useEffect(() => {
    const getBalance = async () => {
      if (provider && userAddress) {
        const balance = await provider.getBalance(userAddress);
        const ethBalance = ethers.formatEther(balance); 
        setBalance(parseFloat(ethBalance).toFixed(4)); 
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
              <>
                <Link to="/manager">Dashboard</Link>
                <Link to="/pending-bookings">Pending Bookings</Link> {/* New link */}
              </>
            ) : (
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
