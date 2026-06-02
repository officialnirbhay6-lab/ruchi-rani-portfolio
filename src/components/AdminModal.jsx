import React, { useState, useEffect } from 'react';
import { X, Lock, Key, Edit3, PlusCircle, CheckCircle, AlertCircle, Upload } from 'lucide-react';

export default function AdminModal({ 
  isOpen, 
  onClose, 
  isAdmin, 
  onLogin, 
  profile, 
  onUpdateProfile, 
  editingArticle, 
  setEditingArticle,
  onAddArticle, 
  onUpdateArticle,
  activeTab,
  setActiveTab
}) {
  // Login Form States
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Profile Form States
  const [profName, setProfName] = useState('');
  const [profTitle, setProfTitle] = useState('');
  const [profLocation, setProfLocation] = useState('');
  const [profBio, setProfBio] = useState('');
  const [profTagline, setProfTagline] = useState('');
  const [profEducation, setProfEducation] = useState('');
  const [profAvatar, setProfAvatar] = useState('');
  const [profBanner, setProfBanner] = useState('');
  const [profLinkedin, setProfLinkedin] = useState('');
  const [profTwitter, setProfTwitter] = useState('');
  const [profEmail, setProfEmail] = useState('');
  const [profBannerY, setProfBannerY] = useState(50);
  const [profAvatarZoom, setProfAvatarZoom] = useState(1);
  const [profAvatarX, setProfAvatarX] = useState(0);
  const [profAvatarY, setProfAvatarY] = useState(0);

  // Article Form States
  const [artTitle, setArtTitle] = useState('');
  const [artDesc, setArtDesc] = useState('');
  const [artLink, setArtLink] = useState('');
  const [artSource, setArtSource] = useState('');
  const [artDate, setArtDate] = useState('');
  const [artImage, setArtImage] = useState('');
  const [artCategory, setArtCategory] = useState('');
  const [artContent, setArtContent] = useState('');

  // Status Alerts
  const [notification, setNotification] = useState({ type: '', message: '' });

  // Sync profile details when tab opens or profile loads
  useEffect(() => {
    if (profile) {
      setProfName(profile.name || '');
      setProfTitle(profile.title || '');
      setProfLocation(profile.location || '');
      setProfBio(profile.bio || '');
      setProfTagline(profile.tagline || '');
      setProfEducation(profile.education || '');
      setProfAvatar(profile.avatar || '');
      setProfBanner(profile.banner || '');
      setProfLinkedin(profile.social?.linkedin || '');
      setProfTwitter(profile.social?.twitter || '');
      setProfEmail(profile.social?.email || '');
      setProfBannerY(profile.bannerY !== undefined ? profile.bannerY : 50);
      setProfAvatarZoom(profile.avatarZoom !== undefined ? profile.avatarZoom : 1);
      setProfAvatarX(profile.avatarX !== undefined ? profile.avatarX : 0);
      setProfAvatarY(profile.avatarY !== undefined ? profile.avatarY : 0);
    }
  }, [profile, isOpen]);

  // Sync editing article when clicked
  useEffect(() => {
    if (editingArticle) {
      setArtTitle(editingArticle.title || '');
      setArtDesc(editingArticle.description || '');
      setArtLink(editingArticle.link || '');
      setArtSource(editingArticle.source || '');
      setArtDate(editingArticle.date || '');
      setArtImage(editingArticle.image || '');
      setArtCategory(editingArticle.category || '');
      setArtContent(editingArticle.content || '');
      setActiveTab('clippings'); // Force tab to clippings
    } else {
      resetArticleForm();
    }
  }, [editingArticle]);

  const resetArticleForm = () => {
    setArtTitle('');
    setArtDesc('');
    setArtLink('');
    setArtSource('');
    setArtDate(new Date().toLocaleDateString('en-US'));
    setArtImage('');
    setArtCategory('');
    setArtContent('');
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      const res = await onLogin(password);
      if (res.success) {
        setPassword('');
      } else {
        setLoginError(res.error || 'Incorrect PIN or Password');
      }
    } catch (err) {
      setLoginError('Server connection error. Ensure backend is running.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Compress and convert File to Base64 String Helper
  const handleImageUpload = (e, target) => {
    const file = e.target.files[0];
    if (!file) return;

    // We can accept larger files now (up to 15MB) because we compress them on the fly!
    if (file.size > 15 * 1024 * 1024) {
      alert("Image is too large. Please select an image under 15MB.");
      return;
    }

    // Set appropriate dimensions and quality depending on the target
    let maxWidth = 800;
    let maxHeight = 600;
    let quality = 0.8;

    if (target === 'avatar') {
      maxWidth = 300;
      maxHeight = 300;
      quality = 0.85;
    } else if (target === 'banner') {
      maxWidth = 1600;
      maxHeight = 900;
      quality = 0.8;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate aspect-ratio compliant dimensions
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        // Create canvas and draw the compressed image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to highly-compressed JPEG base64 DataURL
        const base64String = canvas.toDataURL('image/jpeg', quality);

        if (target === 'avatar') {
          setProfAvatar(base64String);
        } else if (target === 'banner') {
          setProfBanner(base64String);
        } else if (target === 'article') {
          setArtImage(base64String);
        }
      };
      img.onerror = () => {
        // Fallback to raw base64 if image parsing fails
        if (target === 'avatar') {
          setProfAvatar(event.target.result);
        } else if (target === 'banner') {
          setProfBanner(event.target.result);
        } else if (target === 'article') {
          setArtImage(event.target.result);
        }
      };
    };
    reader.readAsDataURL(file);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setNotification({ type: '', message: '' });
    
    const updatedProfile = {
      name: profName,
      title: profTitle,
      location: profLocation,
      bio: profBio,
      tagline: profTagline,
      education: profEducation,
      avatar: profAvatar,
      banner: profBanner,
      bannerY: parseFloat(profBannerY),
      avatarZoom: parseFloat(profAvatarZoom),
      avatarX: parseFloat(profAvatarX),
      avatarY: parseFloat(profAvatarY),
      social: {
        linkedin: profLinkedin,
        twitter: profTwitter,
        email: profEmail
      }
    };

    const res = await onUpdateProfile(updatedProfile);
    if (res.success) {
      setNotification({ type: 'success', message: 'Profile information updated successfully!' });
      setTimeout(() => setNotification({ type: '', message: '' }), 4000);
    } else {
      setNotification({ type: 'error', message: res.error || 'Failed to update profile.' });
    }
  };

  const handleArticleSubmit = async (e) => {
    e.preventDefault();
    setNotification({ type: '', message: '' });

    const articleData = {
      title: artTitle,
      description: artDesc,
      link: artLink || '#',
      source: artSource || 'Freelance',
      date: artDate || new Date().toLocaleDateString('en-US'),
      image: artImage || 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=600',
      category: artCategory || 'Travel Writing',
      content: artContent
    };

    if (editingArticle) {
      // Update Article
      const res = await onUpdateArticle(editingArticle.id, articleData);
      if (res.success) {
        setNotification({ type: 'success', message: 'Clipping updated successfully!' });
        setEditingArticle(null);
        resetArticleForm();
        setTimeout(() => setNotification({ type: '', message: '' }), 4000);
      } else {
        setNotification({ type: 'error', message: res.error || 'Failed to update clipping.' });
      }
    } else {
      // Add Article
      const res = await onAddArticle(articleData);
      if (res.success) {
        setNotification({ type: 'success', message: 'New clipping added successfully!' });
        resetArticleForm();
        setTimeout(() => setNotification({ type: '', message: '' }), 4000);
      } else {
        setNotification({ type: 'error', message: res.error || 'Failed to add clipping.' });
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Modal Header */}
        <div className="modal-header">
          <h2 className="modal-title">
            {isAdmin ? 'Admin Dashboard' : 'Admin Authorization'}
          </h2>
          <button onClick={onClose} className="modal-close-btn" aria-label="Close Modal">
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          
          {/* 1. LOGIN MODE */}
          {!isAdmin ? (
            <div className="login-form-wrapper">
              <Lock size={48} className="login-icon" />
              <h3 className="login-title">Enter Admin Credentials</h3>
              <p className="login-subtitle">Provide your secret password to unlock portfolio management.</p>
              
              {loginError && (
                <div className="alert-banner">
                  <AlertCircle size={16} />
                  <span>{loginError}</span>
                </div>
              )}

              <form onSubmit={handleLoginSubmit} style={{ maxWidth: '320px', margin: '0 auto' }}>
                <div className="form-group" style={{ position: 'relative' }}>
                  <Key size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
                  <input
                    type="password"
                    placeholder="Enter PIN/Password..."
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                    required
                    autoFocus
                  />
                </div>
                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ width: '100%', justifyContent: 'center' }}
                  disabled={isLoggingIn}
                >
                  {isLoggingIn ? 'Verifying...' : 'Unlock Portal'}
                </button>
              </form>
            </div>
          ) : (
            
            /* 2. ADMIN PORTAL MODE */
            <div>
              {/* Notification Banner */}
              {notification.message && (
                <div 
                  className="alert-banner" 
                  style={{ 
                    backgroundColor: notification.type === 'success' ? '#d1fae5' : '#fee2e2',
                    color: notification.type === 'success' ? '#065f46' : '#b91c1c',
                    borderColor: notification.type === 'success' ? '#a7f3d0' : '#fecaca',
                  }}
                >
                  {notification.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                  <span>{notification.message}</span>
                </div>
              )}

              {/* Navigation Tabs */}
              <div className="admin-tabs">
                <button
                  onClick={() => { setActiveTab('profile'); setEditingArticle(null); }}
                  className={`admin-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                >
                  <Edit3 size={14} style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: 'middle' }} />
                  <span>Edit Profile</span>
                </button>
                <button
                  onClick={() => setActiveTab('clippings')}
                  className={`admin-tab-btn ${activeTab === 'clippings' ? 'active' : ''}`}
                >
                  <PlusCircle size={14} style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: 'middle' }} />
                  <span>{editingArticle ? 'Edit Clipping' : 'Add Clipping'}</span>
                </button>
              </div>

              {/* Tab 1: Profile Settings Form */}
              {activeTab === 'profile' && (
                <form onSubmit={handleProfileSubmit}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Full Name</label>
                      <input 
                        type="text" 
                        value={profName} 
                        onChange={(e) => setProfName(e.target.value)} 
                        className="form-input" 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Location (City, Country)</label>
                      <input 
                        type="text" 
                        value={profLocation} 
                        onChange={(e) => setProfLocation(e.target.value)} 
                        className="form-input" 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Professional Subtitle</label>
                    <input 
                      type="text" 
                      value={profTitle} 
                      onChange={(e) => setProfTitle(e.target.value)} 
                      className="form-input" 
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Splash Banner Tagline (shown inside quotes)</label>
                    <input 
                      type="text" 
                      value={profTagline} 
                      onChange={(e) => setProfTagline(e.target.value)} 
                      className="form-input" 
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Education/Affiliation Badge</label>
                      <input 
                        type="text" 
                        value={profEducation} 
                        onChange={(e) => setProfEducation(e.target.value)} 
                        className="form-input" 
                        placeholder="e.g. London School of Journalism"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Contact Email</label>
                      <input 
                        type="email" 
                        value={profEmail} 
                        onChange={(e) => setProfEmail(e.target.value)} 
                        className="form-input" 
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Biography Paragraph</label>
                    <textarea 
                      value={profBio} 
                      onChange={(e) => setProfBio(e.target.value)} 
                      className="form-textarea" 
                      rows={3} 
                      required 
                    />
                  </div>

                  {/* Avatar Upload / URL */}
                  <div className="form-group">
                    <label className="form-label">Profile Portrait Photo</label>
                    <div className="file-upload-wrapper">
                      <input 
                        type="text" 
                        value={profAvatar} 
                        onChange={(e) => setProfAvatar(e.target.value)} 
                        className="form-input" 
                        placeholder="Paste image URL..."
                      />
                      <label className="file-upload-btn">
                        <Upload size={14} />
                        <span>Upload File</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="file-upload-input" 
                          onChange={(e) => handleImageUpload(e, 'avatar')}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Visual Avatar Adjustments (Facebook style) */}
                  <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', border: '1px dashed var(--border-color)' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.75rem', color: 'var(--accent-hover)' }}>
                      Adjust Profile Portrait (Drag/Crop Sliders)
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Zoom Level ({parseFloat(profAvatarZoom).toFixed(2)}x)</label>
                        <input 
                          type="range" 
                          min="1" 
                          max="3" 
                          step="0.05"
                          value={profAvatarZoom} 
                          onChange={(e) => setProfAvatarZoom(e.target.value)} 
                          style={{ padding: 0, height: 'auto', cursor: 'pointer', width: '100%' }}
                        />
                      </div>
                      <div className="form-group" style={{ marginBottom: 0 }}>
                        <label className="form-label" style={{ fontSize: '0.75rem' }}>Vertical Shift ({profAvatarY}px)</label>
                        <input 
                          type="range" 
                          min="-80" 
                          max="80" 
                          step="1"
                          value={profAvatarY} 
                          onChange={(e) => setProfAvatarY(e.target.value)} 
                          style={{ padding: 0, height: 'auto', cursor: 'pointer', width: '100%' }}
                        />
                      </div>
                    </div>
                    <div className="form-group" style={{ marginTop: '0.75rem', marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Horizontal Shift ({profAvatarX}px)</label>
                      <input 
                        type="range" 
                        min="-80" 
                        max="80" 
                        step="1"
                        value={profAvatarX} 
                        onChange={(e) => setProfAvatarX(e.target.value)} 
                        style={{ padding: 0, height: 'auto', cursor: 'pointer', width: '100%' }}
                      />
                    </div>
                    
                    {/* Live Preview Box */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
                      <div style={{ width: '100px', height: '100px', borderRadius: '50%', overflow: 'hidden', position: 'relative', border: '3px solid var(--accent-color)', backgroundColor: 'var(--bg-secondary)' }}>
                        <img 
                          src={profAvatar || '/avatar.png'} 
                          alt="Crop Preview" 
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transform: `scale(${profAvatarZoom}) translate(${profAvatarX}px, ${profAvatarY}px)`,
                            transformOrigin: 'center center'
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Banner Splash Upload / URL */}
                  <div className="form-group">
                    <label className="form-label">Cover Banner Photo</label>
                    <div className="file-upload-wrapper">
                      <input 
                        type="text" 
                        value={profBanner} 
                        onChange={(e) => setProfBanner(e.target.value)} 
                        className="form-input" 
                        placeholder="Paste image URL..."
                      />
                      <label className="file-upload-btn">
                        <Upload size={14} />
                        <span>Upload File</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="file-upload-input" 
                          onChange={(e) => handleImageUpload(e, 'banner')}
                        />
                      </label>
                    </div>
                  </div>

                  {/* Visual Cover Banner Adjustments (Facebook style) */}
                  <div style={{ backgroundColor: 'var(--bg-tertiary)', padding: '1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem', border: '1px dashed var(--border-color)' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, display: 'block', marginBottom: '0.75rem', color: 'var(--accent-hover)' }}>
                      Adjust Cover Banner Position (Shift Up/Down)
                    </span>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label" style={{ fontSize: '0.75rem' }}>Vertical Position Focus ({profBannerY}%)</label>
                      <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        step="1"
                        value={profBannerY} 
                        onChange={(e) => setProfBannerY(e.target.value)} 
                        style={{ padding: 0, height: 'auto', cursor: 'pointer', width: '100%' }}
                      />
                    </div>
                    
                    {/* Live Preview Box */}
                    <div style={{ marginTop: '1rem' }}>
                      <div style={{ width: '100%', height: '80px', borderRadius: 'var(--radius-sm)', overflow: 'hidden', position: 'relative', border: '1px solid var(--border-color)', backgroundImage: `url(${profBanner || '/banner.png'})`, backgroundSize: 'cover', backgroundPosition: `center ${profBannerY}%` }}>
                        <div style={{ position: 'absolute', bottom: '0', width: '100%', background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '0.65rem', textAlign: 'center', padding: '0.2rem 0' }}>
                          Drag slider to center the horizon
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">LinkedIn Profile URL</label>
                      <input 
                        type="url" 
                        value={profLinkedin} 
                        onChange={(e) => setProfLinkedin(e.target.value)} 
                        className="form-input" 
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Twitter/X URL</label>
                      <input 
                        type="url" 
                        value={profTwitter} 
                        onChange={(e) => setProfTwitter(e.target.value)} 
                        className="form-input" 
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
                    Save Profile Changes
                  </button>
                </form>
              )}

              {/* Tab 2: Article Form */}
              {activeTab === 'clippings' && (
                <form onSubmit={handleArticleSubmit}>
                  
                  {editingArticle && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-tertiary)', padding: '0.65rem 1rem', borderRadius: 'var(--radius-sm)', marginBottom: '1.25rem' }}>
                      <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Currently editing: <strong style={{ color: 'var(--accent-color)' }}>{editingArticle.title}</strong></span>
                      <button 
                        type="button" 
                        onClick={() => { setEditingArticle(null); resetArticleForm(); }} 
                        className="btn-secondary" 
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                      >
                        Cancel Edit
                      </button>
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Clipping Title</label>
                    <input 
                      type="text" 
                      value={artTitle} 
                      onChange={(e) => setArtTitle(e.target.value)} 
                      className="form-input" 
                      placeholder="e.g. Navigating Hvar Island, Croatia"
                      required 
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Short Description / Snippet / Lede</label>
                    <textarea 
                      value={artDesc} 
                      onChange={(e) => setArtDesc(e.target.value)} 
                      className="form-textarea" 
                      placeholder="Provide a highly enticing hook or summary of your clipping..."
                      rows={3} 
                      required 
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Publication / Brand Source</label>
                      <input 
                        type="text" 
                        value={artSource} 
                        onChange={(e) => setArtSource(e.target.value)} 
                        className="form-input" 
                        placeholder="e.g. Headout, Wanderlust"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <input 
                        type="text" 
                        value={artCategory} 
                        onChange={(e) => setArtCategory(e.target.value)} 
                        className="form-input" 
                        placeholder="e.g. Travel Writing, Copywriting"
                        required
                      />
                    </div>
                  </div>

                  {/* Dynamic Full Body Content Textarea */}
                  <div className="form-group">
                    <label className="form-label">Full Story / Article Content Body (Write long-form writing here!)</label>
                    <textarea 
                      value={artContent} 
                      onChange={(e) => setArtContent(e.target.value)} 
                      className="form-textarea" 
                      placeholder="Once upon a time in... (Write your full editorial story here)"
                      rows={6}
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Attached External Link (Optional URL)</label>
                      <input 
                        type="text" 
                        value={artLink} 
                        onChange={(e) => setArtLink(e.target.value)} 
                        className="form-input" 
                        placeholder="e.g. https://website.com/article"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Publish Date (MM/DD/YYYY)</label>
                      <input 
                        type="text" 
                        value={artDate} 
                        onChange={(e) => setArtDate(e.target.value)} 
                        className="form-input" 
                        placeholder="e.g. 05/29/2026"
                      />
                    </div>
                  </div>

                  {/* Card Image Upload / URL */}
                  <div className="form-group">
                    <label className="form-label">Card Preview Image</label>
                    <div className="file-upload-wrapper">
                      <input 
                        type="text" 
                        value={artImage} 
                        onChange={(e) => setArtImage(e.target.value)} 
                        className="form-input" 
                        placeholder="Paste image URL..."
                      />
                      <label className="file-upload-btn">
                        <Upload size={14} />
                        <span>Upload File</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="file-upload-input" 
                          onChange={(e) => handleImageUpload(e, 'article')}
                        />
                      </label>
                    </div>
                  </div>

                  <button type="submit" className="btn-primary" style={{ marginTop: '1rem', width: '100%', justifyContent: 'center' }}>
                    {editingArticle ? 'Save Clipping Updates' : 'Add Clipping to Portfolio'}
                  </button>
                </form>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
