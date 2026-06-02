import React from 'react';
import { MapPin, Mail, Linkedin, Twitter, Edit3, Camera } from 'lucide-react';

export default function Profile({ profile, isAdmin, setIsAdminModalOpen, setAdminActiveTab }) {
  const handleEditProfileClick = () => {
    setAdminActiveTab('profile');
    setIsAdminModalOpen(true);
  };

  return (
    <div>
      {/* Top Banner Cover */}
      <div 
        className="splash-banner" 
        style={{ 
          backgroundImage: `url(${profile.banner || '/banner.png'})`,
          backgroundPosition: `center ${profile.bannerY !== undefined ? profile.bannerY : 50}%`
        }}
      >
        <div className="splash-overlay">
          <p className="splash-tagline">
            {profile.tagline || 'Crafting words that take you places'}
          </p>
        </div>

        {/* Hot-Edit Banner Button */}
        {isAdmin && (
          <button 
            onClick={handleEditProfileClick} 
            className="banner-edit-btn"
            title="Change Cover Banner"
          >
            <Camera size={14} />
            <span>Change Cover</span>
          </button>
        )}
      </div>

      {/* Profile Card Overlay */}
      <section className="profile-section container">
        <div className="profile-card">
          
          {/* Avatar and Affiliation Badge */}
          <div className="profile-avatar-container">
            {isAdmin ? (
              <div className="avatar-wrapper" onClick={handleEditProfileClick} title="Change Profile Portrait">
                <div className="avatar-crop-container">
                  <img 
                    src={profile.avatar || '/avatar.png'} 
                    alt={profile.name} 
                    style={{
                      transform: `scale(${profile.avatarZoom || 1}) translate(${profile.avatarX || 0}px, ${profile.avatarY || 0}px)`,
                      transformOrigin: 'center center'
                    }}
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300";
                    }}
                  />
                </div>
                <div className="avatar-edit-overlay">
                  <Camera size={22} />
                  <span>Change Photo</span>
                </div>
              </div>
            ) : (
              <div className="avatar-crop-container">
                <img 
                  src={profile.avatar || '/avatar.png'} 
                  alt={profile.name} 
                  style={{
                    transform: `scale(${profile.avatarZoom || 1}) translate(${profile.avatarX || 0}px, ${profile.avatarY || 0}px)`,
                    transformOrigin: 'center center'
                  }}
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300";
                  }}
                />
              </div>
            )}

            {profile.education && (
              <div className="education-badge" title="Verified Education">
                {profile.education}
              </div>
            )}
          </div>

          {/* Profile Context */}
          <div className="profile-content">
            <div className="profile-name-row">
              <h1 className="profile-name">{profile.name}</h1>
              {profile.location && (
                <div className="profile-location">
                  <MapPin size={16} className="text-teal" />
                  <span>{profile.location}</span>
                </div>
              )}
            </div>

            <h2 className="profile-subtitle">{profile.title}</h2>
            
            <p className="profile-bio">{profile.bio}</p>

            {/* Explicit Display of Contact Email */}
            {profile.social?.email && (
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.45rem', 
                  marginBottom: '1.5rem', 
                  fontSize: '0.9rem', 
                  fontWeight: 500,
                  color: 'var(--text-secondary)' 
                }}
              >
                <Mail size={15} style={{ color: 'var(--accent-color)' }} />
                <span>{profile.social.email}</span>
                {isAdmin && (
                  <button 
                    onClick={handleEditProfileClick} 
                    style={{ padding: '0.15rem 0.35rem', display: 'inline-flex', color: 'var(--accent-color)', fontSize: '0.75rem', fontWeight: 600, border: '1px solid var(--border-color)', borderRadius: '4px', marginLeft: '0.5rem', backgroundColor: 'var(--bg-tertiary)' }}
                    title="Change Email"
                  >
                    Edit Email
                  </button>
                )}
              </div>
            )}

            {/* Profile Footer: Social Links & Contact CTAs */}
            <div className="profile-footer">
              <div className="social-links">
                {profile.social?.linkedin && (
                  <a 
                    href={profile.social.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-icon-btn"
                    title="LinkedIn Profile"
                  >
                    <Linkedin size={18} />
                  </a>
                )}
                {profile.social?.twitter && (
                  <a 
                    href={profile.social.twitter} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="social-icon-btn"
                    title="Twitter Profile"
                  >
                    <Twitter size={18} />
                  </a>
                )}
                {profile.social?.email && (
                  <a 
                    href={`mailto:${profile.social.email}`} 
                    className="social-icon-btn"
                    title="Send Email"
                  >
                    <Mail size={18} />
                  </a>
                )}
              </div>

              <div className="profile-actions">
                {isAdmin && (
                  <button 
                    onClick={handleEditProfileClick} 
                    className="btn-secondary"
                    title="Quick Edit Profile"
                  >
                    <Edit3 size={16} />
                    <span>Edit Profile</span>
                  </button>
                )}
                <a href={`mailto:${profile.social?.email || 'ruchi.rani@example.com'}`} className="btn-primary">
                  <Mail size={16} />
                  <span>Get In Touch</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
