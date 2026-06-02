import React from 'react';
import { Sun, Moon, Lock, Unlock, LogOut } from 'lucide-react';

export default function Header({ theme, toggleTheme, isAdmin, setIsAdminModalOpen, handleLogout }) {
  return (
    <nav className="header-nav glass-panel">
      <div className="container">
        <a href="/" className="brand-logo">
          Ruchi Rani
        </a>
        
        <div className="nav-actions">
          {/* Light/Dark Toggle */}
          <button 
            onClick={toggleTheme} 
            className="nav-btn" 
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          
          {/* Admin Lock Toggle */}
          {isAdmin ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button 
                onClick={() => setIsAdminModalOpen(true)} 
                className="btn-primary" 
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', gap: '0.35rem' }}
                title="Manage Portfolio"
              >
                <Unlock size={14} />
                <span>Dashboard</span>
              </button>
              <button 
                onClick={handleLogout} 
                className="nav-btn" 
                title="Log Out Admin"
                aria-label="Logout Admin"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button 
              onClick={() => setIsAdminModalOpen(true)} 
              className="nav-btn" 
              title="Admin Login"
              aria-label="Admin Login"
            >
              <Lock size={18} />
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
