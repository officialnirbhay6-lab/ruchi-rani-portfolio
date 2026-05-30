import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Profile from './components/Profile.jsx';
import Portfolio from './components/Portfolio.jsx';
import AdminModal from './components/AdminModal.jsx';

export default function App() {
  // Global States
  const [profile, setProfile] = useState({});
  const [articles, setArticles] = useState([]);
  const [theme, setTheme] = useState('light');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminActiveTab, setAdminActiveTab] = useState('profile');
  const [editingArticle, setEditingArticle] = useState(null);

  // 1. Fetch initial portfolio data
  const fetchPortfolioData = async () => {
    try {
      const res = await fetch('/api/portfolio');
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile || {});
        setArticles(data.articles || []);
      }
    } catch (err) {
      console.error("Error fetching portfolio details:", err);
    }
  };

  useEffect(() => {
    fetchPortfolioData();

    // 2. Initialize Theme
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.setAttribute('data-theme', storedTheme);
    } else {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = systemDark ? 'dark' : 'light';
      setTheme(initialTheme);
      document.documentElement.setAttribute('data-theme', initialTheme);
    }

    // 3. Initialize Admin Session
    const storedToken = localStorage.getItem('admin_token');
    if (storedToken === 'token_ruchi_rani_2026') {
      setIsAdmin(true);
    }
  }, []);

  // Theme Toggler
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // Auth Operations
  const handleLogin = async (password) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setIsAdmin(true);
        localStorage.setItem('admin_token', data.token);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Authentication failed' };
      }
    } catch (err) {
      console.error("Login connection error:", err);
      return { success: false, error: 'Connection to server failed' };
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('admin_token');
    setIsAdminModalOpen(false);
    setEditingArticle(null);
  };

  // --- CRUD API MIDDLEWARES ---

  const getHeaders = () => {
    const token = localStorage.getItem('admin_token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  };

  // Update Biography Details
  const handleUpdateProfile = async (updatedProfile) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(updatedProfile)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setProfile(data.profile);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Failed to update profile' };
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      return { success: false, error: 'Network error occurred' };
    }
  };

  // Create New Clipping Card
  const handleAddArticle = async (articleData) => {
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(articleData)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setArticles(prev => [data.article, ...prev]);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Failed to create clipping' };
      }
    } catch (err) {
      console.error("Error creating article:", err);
      return { success: false, error: 'Network error occurred' };
    }
  };

  // Update Existing Clipping Card
  const handleUpdateArticle = async (id, articleData) => {
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(articleData)
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setArticles(prev => prev.map(art => art.id === id ? data.article : art));
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Failed to update clipping' };
      }
    } catch (err) {
      console.error("Error updating article:", err);
      return { success: false, error: 'Network error occurred' };
    }
  };

  // Delete Clipping Card
  const handleDeleteArticle = async (id) => {
    try {
      const response = await fetch(`/api/articles/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setArticles(prev => prev.filter(art => art.id !== id));
      } else {
        alert(data.error || 'Failed to delete clipping');
      }
    } catch (err) {
      console.error("Error deleting article:", err);
      alert('Network connection failed');
    }
  };

  const handleEditClippingClick = (article) => {
    setEditingArticle(article);
    setAdminActiveTab('clippings');
    setIsAdminModalOpen(true);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Brand Navigation */}
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        isAdmin={isAdmin} 
        setIsAdminModalOpen={setIsAdminModalOpen}
        handleLogout={handleLogout}
      />

      <main style={{ flexGrow: 1 }}>
        {/* Splash & About Banner */}
        <Profile 
          profile={profile} 
          isAdmin={isAdmin} 
          setIsAdminModalOpen={setIsAdminModalOpen}
          setAdminActiveTab={setAdminActiveTab}
        />

        {/* Portfolio Dynamic Grid */}
        <Portfolio 
          articles={articles} 
          isAdmin={isAdmin} 
          onEditArticle={handleEditClippingClick}
          onDeleteArticle={handleDeleteArticle}
        />
      </main>

      {/* Editorial Footer */}
      <footer style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', padding: '2rem 1.5rem', textAlign: 'center', transition: 'all var(--transition-speed) ease' }}>
        <p style={{ fontStyle: 'italic', fontFamily: 'var(--font-serif)', fontSize: '1.05rem', color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
          Ruchi Rani &mdash; Travel &amp; Lifestyle Writing Portfolio
        </p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)' }}>
          Powered by React &amp; Node Express. &copy; {new Date().getFullYear()} All Rights Reserved.
        </p>
      </footer>

      {/* Admin Panel Dialog Drawer */}
      <AdminModal 
        isOpen={isAdminModalOpen}
        onClose={() => { setIsAdminModalOpen(false); setEditingArticle(null); }}
        isAdmin={isAdmin}
        onLogin={handleLogin}
        profile={profile}
        onUpdateProfile={handleUpdateProfile}
        editingArticle={editingArticle}
        setEditingArticle={setEditingArticle}
        onAddArticle={handleAddArticle}
        onUpdateArticle={handleUpdateArticle}
        activeTab={adminActiveTab}
        setActiveTab={setAdminActiveTab}
      />

    </div>
  );
}
