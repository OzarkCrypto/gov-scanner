'use client';

import { useState, useEffect, useCallback } from 'react';

function useWindowSize() {
  const [size, setSize] = useState({ width: 1200 });
  useEffect(() => {
    const handleResize = () => setSize({ width: window.innerWidth });
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return size;
}

// Time formatting
function getTimeRemaining(endTime) {
  const now = Date.now();
  const end = new Date(endTime).getTime();
  const diff = end - now;
  
  if (diff <= 0) return 'Ended';
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

function getRelativeTime(date) {
  const now = new Date();
  const then = new Date(date);
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

// Active Votes Panel Component
function ActiveVotesPanel({ votes, loading, error, onRefresh }) {
  const { width } = useWindowSize();
  
  if (loading) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px',
        color: '#666'
      }}>
        Loading active votes from Snapshot...
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px',
        color: '#ef4444'
      }}>
        Error loading votes: {error}
        <button onClick={onRefresh} style={{ marginLeft: '10px', cursor: 'pointer' }}>
          Retry
        </button>
      </div>
    );
  }
  
  if (!votes || votes.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px',
        color: '#666'
      }}>
        No active votes at the moment
      </div>
    );
  }
  
  // Group votes by urgency
  const endingSoon = votes.filter(v => v.status === 'ending-soon');
  const ending48h = votes.filter(v => v.status === 'ending-48h');
  const active = votes.filter(v => v.status === 'active');
  
  const VoteCard = ({ vote, urgent }) => {
    const totalVotes = vote.scores_total || 0;
    
    return (
      <a
        href={vote.link}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'block',
          background: urgent ? 'linear-gradient(135deg, #fef3c7 0%, #fff 100%)' : '#fff',
          border: urgent ? '2px solid #f59e0b' : '1px solid #e5e5e5',
          borderRadius: '12px',
          padding: '14px',
          textDecoration: 'none',
          transition: 'all 0.2s',
          boxShadow: urgent ? '0 4px 12px rgba(245, 158, 11, 0.15)' : 'none'
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = urgent ? '0 4px 12px rgba(245, 158, 11, 0.15)' : 'none';
        }}
      >
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          marginBottom: '8px'
        }}>
          <span style={{ 
            background: '#8B5CF6',
            color: '#fff',
            fontSize: '10px',
            padding: '2px 6px',
            borderRadius: '4px',
            fontWeight: 600
          }}>
            {vote.space.name}
          </span>
          {urgent && (
            <span style={{
              background: '#ef4444',
              color: '#fff',
              fontSize: '9px',
              padding: '2px 5px',
              borderRadius: '3px',
              fontWeight: 600
            }}>
              ⚠️ ENDING SOON
            </span>
          )}
          <span style={{ 
            marginLeft: 'auto',
            fontSize: '11px',
            color: urgent ? '#dc2626' : '#666',
            fontWeight: urgent ? 600 : 400
          }}>
            ⏱️ {vote.timeRemaining}
          </span>
        </div>
        
        {/* Title */}
        <div style={{ 
          fontSize: '13px', 
          fontWeight: 600, 
          color: '#111',
          marginBottom: '10px',
          lineHeight: 1.3,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {vote.title}
        </div>
        
        {/* Progress bar */}
        {vote.scores && vote.scores.length > 0 && (
          <div style={{ marginBottom: '6px' }}>
            <div style={{ 
              height: '6px', 
              background: '#f0f0f0', 
              borderRadius: '3px',
              overflow: 'hidden',
              display: 'flex'
            }}>
              {vote.choices?.slice(0, 3).map((choice, idx) => {
                const pct = totalVotes > 0 ? (vote.scores[idx] || 0) / totalVotes * 100 : 0;
                const colors = ['#22C55E', '#EF4444', '#6B7280'];
                return (
                  <div
                    key={idx}
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: colors[idx] || '#888',
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}
        
        {/* Choices */}
        {vote.choices && (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            fontSize: '11px', 
            flexWrap: 'wrap', 
            gap: '4px' 
          }}>
            {vote.choices.slice(0, 3).map((choice, idx) => {
              const pct = totalVotes > 0 ? (vote.scores?.[idx] || 0) / totalVotes * 100 : 0;
              const colors = ['#22C55E', '#EF4444', '#6B7280'];
              return (
                <span key={idx} style={{ color: colors[idx] || '#888' }}>
                  {choice.length > 15 ? choice.slice(0, 15) + '...' : choice}: {pct.toFixed(1)}%
                </span>
              );
            })}
          </div>
        )}
        
        {/* Stats */}
        <div style={{ fontSize: '10px', color: '#999', marginTop: '8px' }}>
          {vote.votes} voters • {totalVotes > 1000000 
            ? `${(totalVotes/1000000).toFixed(1)}M` 
            : totalVotes > 1000 
            ? `${(totalVotes/1000).toFixed(1)}K`
            : totalVotes.toFixed(0)
          } total votes
        </div>
      </a>
    );
  };
  
  return (
    <div>
      {/* Ending Soon Section */}
      {endingSoon.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            marginBottom: '12px'
          }}>
            <span style={{ 
              background: '#ef4444', 
              color: '#fff', 
              fontSize: '11px', 
              padding: '3px 8px', 
              borderRadius: '4px',
              fontWeight: 600
            }}>
              ⚠️ ENDING IN 24H
            </span>
            <span style={{ fontSize: '12px', color: '#666' }}>
              {endingSoon.length} vote{endingSoon.length > 1 ? 's' : ''}
            </span>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: width < 768 ? '1fr' : 'repeat(2, 1fr)',
            gap: '12px'
          }}>
            {endingSoon.map(vote => (
              <VoteCard key={vote.id} vote={vote} urgent />
            ))}
          </div>
        </div>
      )}
      
      {/* Ending in 48h */}
      {ending48h.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            marginBottom: '12px'
          }}>
            <span style={{ 
              background: '#f59e0b', 
              color: '#fff', 
              fontSize: '11px', 
              padding: '3px 8px', 
              borderRadius: '4px',
              fontWeight: 600
            }}>
              ⏰ ENDING IN 48H
            </span>
            <span style={{ fontSize: '12px', color: '#666' }}>
              {ending48h.length} vote{ending48h.length > 1 ? 's' : ''}
            </span>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: width < 768 ? '1fr' : 'repeat(2, 1fr)',
            gap: '12px'
          }}>
            {ending48h.map(vote => (
              <VoteCard key={vote.id} vote={vote} />
            ))}
          </div>
        </div>
      )}
      
      {/* Active Votes */}
      {active.length > 0 && (
        <div>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px',
            marginBottom: '12px'
          }}>
            <span style={{ 
              background: '#8B5CF6', 
              color: '#fff', 
              fontSize: '11px', 
              padding: '3px 8px', 
              borderRadius: '4px',
              fontWeight: 600
            }}>
              🗳️ ACTIVE
            </span>
            <span style={{ fontSize: '12px', color: '#666' }}>
              {active.length} vote{active.length > 1 ? 's' : ''}
            </span>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: width < 768 ? '1fr' : 'repeat(2, 1fr)',
            gap: '12px'
          }}>
            {active.map(vote => (
              <VoteCard key={vote.id} vote={vote} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Live Forums Section Component
function LiveForumsSection({ forums, loading }) {
  const { width } = useWindowSize();
  
  if (loading) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        color: '#666'
      }}>
        Loading live forum data...
      </div>
    );
  }
  
  const liveForums = forums.filter(f => f.live && f.topics?.length > 0);
  
  if (liveForums.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        color: '#666'
      }}>
        No live forum connections available
      </div>
    );
  }
  
  return (
    <div>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        marginBottom: '16px'
      }}>
        <span style={{ 
          width: '8px', 
          height: '8px', 
          background: '#22C55E', 
          borderRadius: '50%',
          animation: 'pulse 2s infinite'
        }} />
        <span style={{ fontWeight: 600, fontSize: '14px', color: '#111' }}>
          Live Forums
        </span>
        <span style={{ fontSize: '12px', color: '#666' }}>
          {liveForums.length} connected via Discourse API
        </span>
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: width < 768 ? '1fr' : width < 1200 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        gap: '12px'
      }}>
        {liveForums.map(forum => (
          <div key={forum.id} style={{
            background: '#fff',
            borderRadius: '12px',
            padding: '14px',
            border: '1px solid #e5e5e5',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '10px'
            }}>
              <span style={{ 
                background: forum.color,
                color: forum.color === '#FFDBB0' || forum.color === '#DFFE00' || forum.color === '#6CF9D8' || forum.color === '#12FF80' ? '#000' : '#fff',
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '4px',
                fontWeight: 600
              }}>
                {forum.name}
              </span>
              <a 
                href={forum.baseUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ fontSize: '11px', color: '#666', textDecoration: 'none' }}
              >
                ↗ Forum
              </a>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {forum.topics.slice(0, 3).map(topic => (
                <a
                  key={topic.id}
                  href={topic.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 8px',
                    background: '#f8f9fa',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = '#f0f0f0'}
                  onMouseLeave={e => e.currentTarget.style.background = '#f8f9fa'}
                >
                  <span style={{ 
                    flex: 1,
                    fontSize: '12px', 
                    color: '#333',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>
                    {topic.title}
                  </span>
                  <span style={{ 
                    fontSize: '10px', 
                    color: '#999',
                    whiteSpace: 'nowrap'
                  }}>
                    {getRelativeTime(topic.bumped_at)}
                  </span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Main Component
export default function Home() {
  const { width } = useWindowSize();
  const [activeTab, setActiveTab] = useState('votes');
  
  // API State
  const [forumsData, setForumsData] = useState([]);
  const [votesData, setVotesData] = useState([]);
  const [forumsLoading, setForumsLoading] = useState(true);
  const [votesLoading, setVotesLoading] = useState(true);
  const [forumsError, setForumsError] = useState(null);
  const [votesError, setVotesError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  
  // Fetch forums data
  const fetchForums = useCallback(async () => {
    setForumsLoading(true);
    try {
      const res = await fetch('/api/forums');
      const data = await res.json();
      setForumsData(data.forums || []);
      setForumsError(null);
    } catch (err) {
      setForumsError(err.message);
    } finally {
      setForumsLoading(false);
    }
  }, []);
  
  // Fetch votes data
  const fetchVotes = useCallback(async () => {
    setVotesLoading(true);
    try {
      const res = await fetch('/api/votes');
      const data = await res.json();
      setVotesData(data.active || []);
      setVotesError(null);
      setLastUpdate(new Date());
    } catch (err) {
      setVotesError(err.message);
    } finally {
      setVotesLoading(false);
    }
  }, []);
  
  // Initial fetch
  useEffect(() => {
    fetchForums();
    fetchVotes();
  }, [fetchForums, fetchVotes]);
  
  // Auto-refresh every 5 minutes for votes, 30 minutes for forums
  useEffect(() => {
    const votesInterval = setInterval(fetchVotes, 5 * 60 * 1000);
    const forumsInterval = setInterval(fetchForums, 30 * 60 * 1000);
    return () => {
      clearInterval(votesInterval);
      clearInterval(forumsInterval);
    };
  }, [fetchVotes, fetchForums]);
  
  // Stats
  const endingSoonCount = votesData.filter(v => v.status === 'ending-soon').length;
  const liveForumsCount = forumsData.filter(f => f.live).length;
  
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8f9fa',
      padding: width < 768 ? '12px' : '20px'
    }}>
      {/* CSS for animations */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
      
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <h1 style={{ 
              fontSize: width < 768 ? '24px' : '28px', 
              fontWeight: 700, 
              color: '#111',
              margin: 0
            }}>
              🏛️ Gov Scanner
            </h1>
            <p style={{ 
              fontSize: '13px', 
              color: '#666', 
              margin: '4px 0 0 0'
            }}>
              DeFi Governance Tracker • {votesData.length} active votes • {liveForumsCount} live forums
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {lastUpdate && (
              <span style={{ fontSize: '11px', color: '#999' }}>
                Updated: {lastUpdate.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={() => { fetchVotes(); fetchForums(); }}
              style={{
                background: '#fff',
                border: '1px solid #e5e5e5',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              ↻ Refresh
            </button>
          </div>
        </div>
        
        {/* Urgent Alert Banner */}
        {endingSoonCount > 0 && (
          <div style={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            border: '2px solid #f59e0b',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{ fontSize: '24px' }}>⚠️</span>
            <div>
              <div style={{ fontWeight: 600, color: '#92400e' }}>
                {endingSoonCount} vote{endingSoonCount > 1 ? 's' : ''} ending within 24 hours!
              </div>
              <div style={{ fontSize: '12px', color: '#a16207' }}>
                Check the Active Votes tab for details
              </div>
            </div>
          </div>
        )}
        
        {/* Tabs */}
        <div style={{ 
          display: 'flex', 
          gap: '4px', 
          marginBottom: '16px',
          background: '#fff',
          padding: '4px',
          borderRadius: '8px',
          border: '1px solid #e5e5e5',
          width: 'fit-content'
        }}>
          <button
            onClick={() => setActiveTab('votes')}
            style={{
              background: activeTab === 'votes' ? '#8B5CF6' : 'transparent',
              color: activeTab === 'votes' ? '#fff' : '#666',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '13px',
              cursor: 'pointer',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            🗳️ Active Votes
            {votesData.length > 0 && (
              <span style={{
                background: activeTab === 'votes' ? 'rgba(255,255,255,0.2)' : '#8B5CF6',
                color: '#fff',
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '10px'
              }}>
                {votesData.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('forums')}
            style={{
              background: activeTab === 'forums' ? '#111' : 'transparent',
              color: activeTab === 'forums' ? '#fff' : '#666',
              border: 'none',
              borderRadius: '6px',
              padding: '8px 16px',
              fontSize: '13px',
              cursor: 'pointer',
              fontWeight: 500,
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            💬 Forums
            {liveForumsCount > 0 && (
              <span style={{
                background: activeTab === 'forums' ? 'rgba(255,255,255,0.2)' : '#22C55E',
                color: '#fff',
                fontSize: '10px',
                padding: '2px 6px',
                borderRadius: '10px'
              }}>
                {liveForumsCount} live
              </span>
            )}
          </button>
        </div>
        
        {/* Content */}
        {activeTab === 'votes' && (
          <ActiveVotesPanel 
            votes={votesData} 
            loading={votesLoading} 
            error={votesError}
            onRefresh={fetchVotes}
          />
        )}
        
        {activeTab === 'forums' && (
          <LiveForumsSection 
            forums={forumsData} 
            loading={forumsLoading}
          />
        )}
        
        {/* Footer */}
        <div style={{ 
          marginTop: '40px', 
          padding: '20px', 
          textAlign: 'center',
          borderTop: '1px solid #e5e5e5'
        }}>
          <p style={{ fontSize: '12px', color: '#999' }}>
            Data sources: Snapshot API (votes) • Discourse API (forums)
          </p>
          <p style={{ fontSize: '11px', color: '#bbb', marginTop: '4px' }}>
            Auto-refresh: Votes every 5min • Forums every 30min
          </p>
        </div>
      </div>
    </div>
  );
}
