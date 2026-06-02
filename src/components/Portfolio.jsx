import React, { useState, useMemo } from 'react';
import { Search, Edit, Trash2, BookOpen, ExternalLink, X, Calendar, Globe } from 'lucide-react';

export default function Portfolio({ articles, isAdmin, onEditArticle, onDeleteArticle }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedArticle, setSelectedArticle] = useState(null);

  // 1. Get unique categories
  const categories = useMemo(() => {
    const list = new Set(articles.map(a => a.category));
    return ['All', ...Array.from(list)];
  }, [articles]);

  // 2. Filter articles based on active tab and search query
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
      const query = searchQuery.toLowerCase();
      const matchesSearch = 
        article.title.toLowerCase().includes(query) ||
        (article.description && article.description.toLowerCase().includes(query)) ||
        (article.source && article.source.toLowerCase().includes(query)) ||
        (article.category && article.category.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [articles, activeCategory, searchQuery]);

  // 3. Workable Hybrid Click Handler: opens external link if no body story is present
  const handleCardClick = (article) => {
    if (article.content && article.content.trim() !== '') {
      setSelectedArticle(article);
    } else if (article.link && article.link !== '#') {
      window.open(article.link, '_blank', 'noopener,noreferrer');
    } else {
      setSelectedArticle(article); // Fallback to display description
    }
  };

  return (
    <section className="container" style={{ paddingBottom: '5rem' }}>
      
      {/* Section Divider: Portfolio Title Block */}
      <div className="section-title-divider">
        <span className="section-title-label">Portfolio</span>
      </div>

      {/* Portfolio Header with Tabs & Search */}
      <div className="portfolio-header">
        <ul className="filter-tabs">
          {categories.map(cat => (
            <li key={cat}>
              <button
                onClick={() => setActiveCategory(cat)}
                className={`filter-tab ${activeCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            </li>
          ))}
        </ul>

        <div className="search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search clippings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Clippings Grid */}
      {filteredArticles.length > 0 ? (
        <div className="portfolio-grid">
          {filteredArticles.map(article => (
            <article 
              key={article.id} 
              className="grid-item-card"
              onClick={() => handleCardClick(article)}
            >
              
              {/* Image Preview */}
              <div className="card-image-wrapper">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="card-image"
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=600";
                  }}
                />
                
                {/* Admin quick controls */}
                {isAdmin && (
                  <div className="card-actions-admin" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => onEditArticle(article)} 
                      className="admin-card-btn"
                      title="Edit Clipping"
                    >
                      <Edit size={14} />
                    </button>
                    <button 
                      onClick={() => {
                        if (confirm(`Are you sure you want to delete "${article.title}"?`)) {
                          onDeleteArticle(article.id);
                        }
                      }} 
                      className="admin-card-btn"
                      style={{ color: '#ef4444' }}
                      title="Delete Clipping"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Card Meta Content */}
              <div className="card-body">
                <div className="card-meta">
                  <span className="card-source">{article.source}</span>
                  <span>{article.date}</span>
                </div>
                
                <h3 className="card-title">
                  <span className="card-title-link">
                    {article.title}
                  </span>
                </h3>
                
                <p className="card-description">{article.description}</p>
              </div>

            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <BookOpen size={48} className="empty-state-icon" />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>No clippings found</h3>
          <p style={{ fontSize: '0.9rem' }}>Try adjusting your filters or search keywords.</p>
        </div>
      )}

      {/* IMMERSIVE FULL STORY WRITING VIEWER MODAL */}
      {selectedArticle && (
        <div className="reader-overlay" onClick={() => setSelectedArticle(null)}>
          <div className="reader-content" onClick={(e) => e.stopPropagation()}>
            
            {/* Top Hero Picture with Floating Close */}
            <div className="reader-hero-wrapper">
              <img 
                src={selectedArticle.image} 
                alt={selectedArticle.title} 
                className="reader-hero-image" 
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=600";
                }}
              />
              <button 
                onClick={() => setSelectedArticle(null)} 
                className="reader-close-btn"
                aria-label="Close Story Reader"
              >
                <X size={20} />
              </button>
            </div>

            {/* Immersive Editorial Body */}
            <div className="reader-body-wrapper">
              
              {/* Category & Date Meta */}
              <div className="reader-meta-row">
                <span className="reader-source">{selectedArticle.source}</span>
                <span>&bull;</span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <Calendar size={13} />
                  <span>{selectedArticle.date}</span>
                </span>
                <span>&bull;</span>
                <span style={{ backgroundColor: 'var(--bg-tertiary)', padding: '0.25rem 0.6rem', borderRadius: '4px', textTransform: 'none' }}>
                  {selectedArticle.category}
                </span>
              </div>

              {/* Serif Headline */}
              <h1 className="reader-title">{selectedArticle.title}</h1>
              
              <div className="reader-divider"></div>

              {/* Book-like editorial paragraphs */}
              <div className="reader-paragraphs">
                {selectedArticle.content ? (
                  selectedArticle.content.split('\n').map((para, idx) => {
                    if (para.trim() === '') return null;
                    return <p key={idx}>{para}</p>;
                  })
                ) : (
                  <p>{selectedArticle.description}</p>
                )}
              </div>

              {/* Attached External Link Box */}
              {selectedArticle.link && selectedArticle.link !== '#' && (
                <div className="attached-link-box">
                  <Globe size={32} style={{ color: 'var(--accent-color)', marginBottom: '0.75rem' }} />
                  <h3 className="attached-link-title">Explore Attached Reference</h3>
                  <p className="attached-link-desc">
                    This story is linked to an external publication. You can visit the live original work or reference page below:
                  </p>
                  <a 
                    href={selectedArticle.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{ margin: '0 auto', gap: '0.4rem' }}
                  >
                    <span>Visit Original Publication</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              )}

            </div>

          </div>
        </div>
      )}

    </section>
  );
}
