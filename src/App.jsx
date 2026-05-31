import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Profile from './components/Profile.jsx';
import Portfolio from './components/Portfolio.jsx';
import AdminModal from './components/AdminModal.jsx';

export default function App() {
  // Global States
  // Helper to load cached data for instant, flash-free loading of live custom changes
  const getCachedProfile = () => {
    try {
      const cached = localStorage.getItem('cached_profile');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return {
      name: "Ruchi Rani",
      title: "Travel & Lifestyle Writer | Culture, Luxury & Destination Storytelling",
      location: "Bengaluru, India",
      bio: "I write travel stories that make readers feel like they've walked the streets, met the people, and lived the moments themselves.",
      education: "London School of Journalism (LSJ)",
      tagline: "Crafting words that take you places",
      avatar: "/avatar.png",
      banner: "/banner.png",
      social: {
        linkedin: "https://www.linkedin.com/in/ruchi-rani-295100249/",
        email: "ruchi.rani@example.com",
        twitter: "https://twitter.com/ruchi_rani"
      }
    };
  };

  const getCachedArticles = () => {
    try {
      const cached = localStorage.getItem('cached_articles');
      if (cached) return JSON.parse(cached);
    } catch (e) {}
    return [
      {
        id: 1,
        title: "Budapest River Cruise | Tokaj Frizzante & Danube Views",
        description: "Wrote engaging product content for Budapest's premium 1-hour Danube sightseeing cruise with Tokaj Frizzante, inviting audiences to enjoy iconic riverfront views while savoring luxury drinks.",
        link: "https://www.headout.com",
        source: "Headout",
        date: "09/01/2025",
        image: "https://images.unsplash.com/photo-1565152285888-0f04e17ef1bc?auto=format&fit=crop&q=80&w=600",
        category: "Travel Writing",
        content: "Sailing down the majestic Danube in Budapest is a rite of passage, but doing so with a glass of premium Tokaj Frizzante transforms it into a sensory masterpiece. As the sun sets, casting a warm amber glow over the Hungarian Parliament and the historic Buda Castle, the gentle fizz of Hungary’s finest sparkling wine complements the rhythmic flowing of the river.\n\nOur product copywriting for Headout was designed to elicit this exact, high-end sensation. Rather than listing a directory of times and prices, we focused on sensory alignment—the cool breeze touching your skin, the sparkling lights of the Chain Bridge reflecting on the water, and the unique sweet-acidic balance of Tokaj grapes.\n\nThis copy successfully targeted affluent travelers seeking authentic, upscale European experiences, resulting in a direct increase in conversion rates for the UK and Benelux tourist demographics."
      },
      {
        id: 2,
        title: "Hotel Juna Mahal | Sawai Madhopur | Ranthambore",
        description: "Developed SEO-optimized website copy and immersive promotional descriptions for a premium luxury heritage resort, enhancing digital visibility and high-end positioning.",
        link: "https://www.simplotel.com",
        source: "Simplotel",
        date: "09/15/2023",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600",
        category: "Hospitality Copywriting",
        content: "Nestled amid the ancient, wild foothills of Ranthambore, Hotel Juna Mahal is a stunning architectural marvel that marries historical Rajasthani heritage with modern opulent luxury. Crafting the web copy for this hospitality jewel required a deep appreciation of both local cultural history and strict SEO keyword architecture.\n\nOur copy strategy focused on dual-intent storytelling. For the luxury traveler, we brought the physical experience of Juna Mahal to life through words—the hand-carved stone pillars, the private pools looking out to the forest, and the call of wild peacocks at dawn. For the search engines, we seamlessly integrated highly strategic keywords like 'luxury heritage resort Ranthambore' and 'best boutique hotels in Sawai Madhopur' into headings and natural flowing text.\n\nThe results were immediate. Simplotel’s technical deployment saw Juna Mahal rise to page 1 of search engine results, capturing organic booking traffic and commanding a premium digital authority."
      },
      {
        id: 3,
        title: "Silent Wonders of African Safaris",
        description: "A deep dive into how electric-powered safari vehicles are revolutionizing conservation travel, reducing carbon footprints, and allowing travelers to hear the true, uninterrupted voice of the wild.",
        link: "#",
        source: "Wanderlust",
        date: "11/20/2025",
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&q=80&w=600",
        category: "Destination Storytelling",
        content: "For generations, the soundtrack of an African safari was dominated by the loud, mechanical rattle of a diesel engine. But a silent revolution is spreading across the plains of the Maasai Mara and the Serengeti—powered entirely by solar energy and electric-drive engineering.\n\nElectric safari vehicles (e-safari cars) are completely changing the sensory experience of the wilderness. Because the engine is virtually silent, you can hear the soft crunch of grass beneath an elephant's foot, the low-frequency rumbling of lions communicating, and the calls of birds before they fly. Animals are also noticeably calmer, allowing vehicles to sit quietly alongside them without causing stress.\n\nIn this editorial piece, we explore the deep, positive impacts of silent tourism, interviewing local guides who describe e-safaris not as a tech gimmick, but as a return to the natural harmony of the wild."
      },
      {
        id: 4,
        title: "Navigating the Hidden Alleys of Hvar, Croatia",
        description: "An intimate exploration of Hvar Island beyond the yachts. Winding through centuries-old lavender farms, olive groves, and family-owned taverns that preserve the historic heart of the Adriatic.",
        link: "#",
        source: "National Geographic Traveller",
        date: "04/28/2026",
        image: "https://images.unsplash.com/photo-1505080856163-267552912e1f?auto=format&fit=crop&q=80&w=600",
        category: "Travel Writing",
        content: "Hvar is famous for its glittering yachts, exclusive beach clubs, and late-night parties. But if you take a sharp turn past the limestone fortress and follow the narrow stone staircases climbing into the hills, you discover a Hvar that belongs to another century.\n\nIn the quiet alleys of Stari Grad and the rustic mountain villages, the air smells deeply of wild lavender, sage, and woodsmoke. Here, family-run konobas (taverns) serve traditional Dalmatian peka cooked under iron domes in glowing embers. The olive oil is pressed in mills that have operated for three hundred years, and the wine is made from grape varieties unique to these rocky shores.\n\nThis travel story is a love letter to slow Croatian living, encouraging visitors to step away from the crowded harbors and lose themselves in the authentic lavender-scented soul of the island."
      },
      {
        id: 5,
        title: "The Art of SEO Storytelling for High-End Brands",
        description: "Demonstrating how travel brands can marry technical search engine optimization with breathtaking, highly evocative copywriting to command search authority without sacrificing brand premium feel.",
        link: "https://www.gocomet.com",
        source: "GoComet",
        date: "08/15/2024",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80&w=600",
        category: "SEO & Strategy",
        content: "Many digital marketers believe that SEO and beautiful creative writing are natural enemies. They think that satisfying Google's algorithms requires packing pages with stiff, repetitive phrases that alienate human readers.\n\nWe disagree. In this strategic whitepaper, we show that the highest-converting content is actually born when technical optimization meets emotional storytelling. By analyzing the search intent of luxury travelers, we can discover exactly what answers they seek, and deliver those answers using breathtaking, sensory-rich editorial copy.\n\nWe provide a step-by-step framework for mapping keywords to emotional milestones, showing how luxury hotels and travel booking portals can double their organic search traffic while cementing their premium brand prestige."
      }
    ];
  };

  const [profile, setProfile] = useState(getCachedProfile);
  const [articles, setArticles] = useState(getCachedArticles);
  const [theme, setTheme] = useState('light');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [adminActiveTab, setAdminActiveTab] = useState('profile');
  const [editingArticle, setEditingArticle] = useState(null);

  const fetchPortfolioData = async () => {
    try {
      const res = await fetch('/api/portfolio');
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile || {});
        setArticles(data.articles || []);

        // Cache live changes for instant, flash-free loading on next refresh
        if (data.profile) localStorage.setItem('cached_profile', JSON.stringify(data.profile));
        if (data.articles) localStorage.setItem('cached_articles', JSON.stringify(data.articles));
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
        localStorage.setItem('cached_profile', JSON.stringify(data.profile));
        return { success: true };
      } else {
        const errMsg = data.details ? `${data.error} Details: ${data.details}` : (data.error || 'Failed to update profile');
        return { success: false, error: errMsg };
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
        setArticles(prev => {
          const updated = [data.article, ...prev];
          localStorage.setItem('cached_articles', JSON.stringify(updated));
          return updated;
        });
        return { success: true };
      } else {
        const errMsg = data.details ? `${data.error} Details: ${data.details}` : (data.error || 'Failed to create clipping');
        return { success: false, error: errMsg };
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
        setArticles(prev => {
          const updated = prev.map(art => art.id === id ? data.article : art);
          localStorage.setItem('cached_articles', JSON.stringify(updated));
          return updated;
        });
        return { success: true };
      } else {
        const errMsg = data.details ? `${data.error} Details: ${data.details}` : (data.error || 'Failed to update clipping');
        return { success: false, error: errMsg };
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
        setArticles(prev => {
          const updated = prev.filter(art => art.id !== id);
          localStorage.setItem('cached_articles', JSON.stringify(updated));
          return updated;
        });
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
