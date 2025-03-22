import React from 'react';
import PropTypes from 'prop-types';
import '../styles/Header.css';

const Header = ({ totalBalance, onEditIncome, currentPage, onPageChange }) => {
  return (
    <header className="main-header">
      <div className="header-content">
        <div className="logo">
          <span className="logo-icon">💰</span>
          <h1 className="logo-text">Expenza</h1>
        </div>

        <nav className="header-nav">
          <button 
            className={`nav-link ${currentPage === 'home' ? 'active' : ''}`}
            onClick={() => onPageChange('home')}
          >
            Home
          </button>
          <button 
            className={`nav-link ${currentPage === 'history' ? 'active' : ''}`}
            onClick={() => onPageChange('history')}
          >
            History
          </button>
          <button 
            className={`nav-link ${currentPage === 'split' ? 'active' : ''}`}
            onClick={() => onPageChange('split')}
          >
            Split Expense
          </button>
        </nav>

        <div className="balance-summary">
          <div className="balance-info">
            <span className="balance-label">Current Balance</span>
            <span className={`balance-amount ${totalBalance < 0 ? 'amount-negative' : 'amount-positive'}`}>
              ₹{Math.abs(totalBalance).toLocaleString('en-IN', { maximumFractionDigits: 2 })}
            </span>
          </div>
          <button className="edit-income-btn" onClick={onEditIncome}>
            Edit Income
          </button>
        </div>
        <div>
          <button>Login</button>
        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  totalBalance: PropTypes.number.isRequired,
  onEditIncome: PropTypes.func.isRequired,
  currentPage: PropTypes.oneOf(['home', 'history', 'split']).isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Header;
