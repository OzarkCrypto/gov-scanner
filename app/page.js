'use client';

import { useState, useEffect } from 'react';

const FORUMS = [
  { id: 'aave', name: 'Aave', url: 'https://governance.aave.com', color: '#B6509E', token: 'AAVE' },
  { id: 'lido', name: 'Lido', url: 'https://research.lido.fi', color: '#00A3FF', token: 'LDO' },
  { id: 'curve', name: 'Curve', url: 'https://gov.curve.fi', color: '#FF6B6B', token: 'CRV' },
  { id: 'uniswap', name: 'Uniswap', url: 'https://gov.uniswap.org', color: '#FF007A', token: 'UNI' },
  { id: 'compound', name: 'Compound', url: 'https://www.comp.xyz', color: '#00D395', token: 'COMP' },
  { id: 'maker', name: 'MakerDAO', url: 'https://forum.makerdao.com', color: '#1AAB9B', token: 'MKR' },
  { id: 'arbitrum', name: 'Arbitrum', url: 'https://forum.arbitrum.foundation', color: '#28A0F0', token: 'ARB' },
  { id: 'optimism', name: 'Optimism', url: 'https://gov.optimism.io', color: '#FF0420', token: 'OP' }
];

const DRAMA_KEYWORDS = ['urgent', 'emergency', 'hack', 'exploit', 'vulnerability', 'attack', 'dump', 'concern', 'risk', 'warning', 'critical', 'bug', 'dispute', 'controversy', 'conflict', 'failed', 'reject', 'manipulation', 'whale', 'governance attack', 'compensation', 'lawsuit', 'legal', 'fork', 'resign', 'removed'];
const HOT_KEYWORDS = ['proposal', 'vote', 'snapshot', 'quorum', 'passed', 'approved', 'upgrade', 'airdrop', 'incentive', 'grant'];

function detectSentiment(title) {
  const text = title.toLowerCase();
  const dramaScore = DRAMA_KEYWORDS.filter(k => text.includes(k)).length;
  const hotScore = HOT_KEYWORDS.filter(k => text.includes(k)).length;
  if (dramaScore >= 2) return { level: 'drama', tag: '🔥' };
  if (dramaScore >= 1) return { level: 'warning', tag: '⚠️' };
  if (hotScore >= 1) return { level: 'hot', tag: '🗳️' };
  return { level: 'normal', tag: '' };
}

function timeAgo(dateString) {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
  return `${Math.floor(seconds / 86400)}d`;
}

function getMockTopics(forumId) {
  const data = {
    aave: [
      { id: 1, slug: 'a', title: '[ARFC] Risk Parameter Updates - Polygon v3', posts_count: 23, views: 1205, created_at: new Date(Date.now() - 3600000).toISOString() },
      { id: 2, slug: 'b', title: 'Emergency Response to Oracle Manipulation Attempt', posts_count: 89, views: 4520, created_at: new Date(Date.now() - 7200000).toISOString() },
      { id: 3, slug: 'c', title: '[TEMP CHECK] Add weETH as Collateral', posts_count: 45, views: 2100, created_at: new Date(Date.now() - 14400000).toISOString() },
      { id: 4, slug: 'd', title: 'GHO Stability Module Parameters', posts_count: 12, views: 890, created_at: new Date(Date.now() - 28800000).toISOString() },
    ],
    lido: [
      { id: 1, slug: 'a', title: 'Concerns about validator concentration risk', posts_count: 156, views: 8900, created_at: new Date(Date.now() - 1800000).toISOString() },
      { id: 2, slug: 'b', title: '[LIP-XX] stETH withdrawal queue optimization', posts_count: 34, views: 1800, created_at: new Date(Date.now() - 5400000).toISOString() },
      { id: 3, slug: 'c', title: 'Snapshot Vote: Treasury Diversification', posts_count: 67, views: 3400, created_at: new Date(Date.now() - 10800000).toISOString() },
      { id: 4, slug: 'd', title: 'Node Operator Set Expansion', posts_count: 28, views: 1200, created_at: new Date(Date.now() - 21600000).toISOString() },
    ],
    curve: [
      { id: 1, slug: 'a', title: '🚨 URGENT: Vyper Exploit Post-Mortem', posts_count: 234, views: 15600, created_at: new Date(Date.now() - 900000).toISOString() },
      { id: 2, slug: 'b', title: '[PROPOSAL] Compensation Plan for Affected LPs', posts_count: 189, views: 9800, created_at: new Date(Date.now() - 3600000).toISOString() },
      { id: 3, slug: 'c', title: 'Gauge Weight Vote - Week 52', posts_count: 23, views: 890, created_at: new Date(Date.now() - 21600000).toISOString() },
      { id: 4, slug: 'd', title: 'crvUSD Market Expansion', posts_count: 45, views: 2300, created_at: new Date(Date.now() - 43200000).toISOString() },
    ],
    uniswap: [
      { id: 1, slug: 'a', title: '[RFC] Fee Switch Activation - Final Discussion', posts_count: 456, views: 23400, created_at: new Date(Date.now() - 2700000).toISOString() },
      { id: 2, slug: 'b', title: 'Cross-chain Expansion Strategy', posts_count: 78, views: 4500, created_at: new Date(Date.now() - 9000000).toISOString() },
      { id: 3, slug: 'c', title: 'UNI Grants Program - Q1 2025', posts_count: 34, views: 2100, created_at: new Date(Date.now() - 18000000).toISOString() },
      { id: 4, slug: 'd', title: 'V4 Hook Security Framework', posts_count: 56, views: 3200, created_at: new Date(Date.now() - 36000000).toISOString() },
    ],
    compound: [
      { id: 1, slug: 'a', title: 'Gauntlet Risk Parameter Recommendations', posts_count: 45, views: 2300, created_at: new Date(Date.now() - 4500000).toISOString() },
      { id: 2, slug: 'b', title: 'Warning: Large whale accumulating COMP', posts_count: 123, views: 7800, created_at: new Date(Date.now() - 1200000).toISOString() },
      { id: 3, slug: 'c', title: 'Compound III Migration Timeline', posts_count: 67, views: 3400, created_at: new Date(Date.now() - 14400000).toISOString() },
      { id: 4, slug: 'd', title: 'New Market: wstETH', posts_count: 23, views: 1100, created_at: new Date(Date.now() - 28800000).toISOString() },
    ],
    maker: [
      { id: 1, slug: 'a', title: 'Executive Vote: Stability Fee Adjustment', posts_count: 89, views: 4500, created_at: new Date(Date.now() - 5400000).toISOString() },
      { id: 2, slug: 'b', title: 'Governance Attack Prevention Framework', posts_count: 234, views: 12300, created_at: new Date(Date.now() - 1800000).toISOString() },
      { id: 3, slug: 'c', title: 'Risk Assessment: RWA Collateral Concerns', posts_count: 156, views: 8900, created_at: new Date(Date.now() - 7200000).toISOString() },
      { id: 4, slug: 'd', title: 'SubDAO Tokenomics Update', posts_count: 67, views: 3400, created_at: new Date(Date.now() - 14400000).toISOString() },
    ],
    arbitrum: [
      { id: 1, slug: 'a', title: '[AIP-XX] Sequencer Revenue Distribution', posts_count: 78, views: 5600, created_at: new Date(Date.now() - 3600000).toISOString() },
      { id: 2, slug: 'b', title: 'Controversy: Foundation Multi-sig Actions', posts_count: 345, views: 18900, created_at: new Date(Date.now() - 600000).toISOString() },
      { id: 3, slug: 'c', title: 'STIP Round 2 - Project Allocations', posts_count: 123, views: 7800, created_at: new Date(Date.now() - 10800000).toISOString() },
      { id: 4, slug: 'd', title: 'Stylus Grants Program', posts_count: 34, views: 2100, created_at: new Date(Date.now() - 21600000).toISOString() },
    ],
    optimism: [
      { id: 1, slug: 'a', title: '[PROPOSAL] RetroPGF Round 4 Design', posts_count: 234, views: 12300, created_at: new Date(Date.now() - 4500000).toISOString() },
      { id: 2, slug: 'b', title: 'Delegate Accountability Framework', posts_count: 89, views: 4500, created_at: new Date(Date.now() - 9000000).toISOString() },
      { id: 3, slug: 'c', title: 'Voting Cycle 19: Active Proposals', posts_count: 45, views: 2300, created_at: new Date(Date.now() - 18000000).toISOString() },
      { id: 4, slug: 'd', title: 'Superchain Expansion Roadmap', posts_count: 56, views: 3100, created_at: new Date(Date.now() - 28800000).toISOString() },
    ]
  };
  return (data[forumId] || []).map(t => ({ ...t, sentiment: detectSentiment(t.title) }));
}

function ForumSection({ forum, topics }) {
  const dramaCount = topics.filter(t => t.sentiment.level === 'drama').length;
  
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '6px', 
        marginBottom: '4px',
        paddingBottom: '3px',
        borderBottom: `2px solid ${forum.color}`
      }}>
        <span style={{ fontWeight: 600, color: '#111', fontSize: '12px' }}>{forum.name}</span>
        <span style={{ color: '#aaa', fontSize: '10px' }}>${forum.token}</span>
        {dramaCount > 0 && (
          <span style={{ 
            background: '#fee2e2', 
            color: '#dc2626', 
            fontSize: '9px', 
            padding: '1px 4px', 
            borderRadius: '2px',
            fontWeight: 600
          }}>
            {dramaCount}
          </span>
        )}
        <a 
          href={forum.url} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ marginLeft: 'auto', color: '#bbb', fontSize: '10px', textDecoration: 'none' }}
        >
          ↗
        </a>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
        {topics.slice(0, 4).map((topic, idx) => (
          <a
            key={idx}
            href={`${forum.url}/t/${topic.slug}/${topic.id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 4px',
              textDecoration: 'none',
              borderRadius: '3px',
              background: topic.sentiment.level === 'drama' ? '#fef2f2' : 'transparent',
            }}
            onMouseEnter={e => { if (topic.sentiment.level !== 'drama') e.currentTarget.style.background = '#f8f8f8'; }}
            onMouseLeave={e => { if (topic.sentiment.level !== 'drama') e.currentTarget.style.background = 'transparent'; }}
          >
            {topic.sentiment.tag && (
              <span style={{ fontSize: '10px', flexShrink: 0, width: '14px' }}>{topic.sentiment.tag}</span>
            )}
            {!topic.sentiment.tag && <span style={{ width: '14px', flexShrink: 0 }}></span>}
            <span style={{ 
              flex: 1, 
              fontSize: '11px', 
              color: '#444',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {topic.title}
            </span>
            <span style={{ fontSize: '9px', color: '#bbb', flexShrink: 0 }}>
              {topic.posts_count}
            </span>
            <span style={{ fontSize: '9px', color: forum.color, flexShrink: 0, width: '18px', textAlign: 'right' }}>
              {timeAgo(topic.created_at)}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [forumData, setForumData] = useState({});
  const [lastUpdate, setLastUpdate] = useState(null);
  
  useEffect(() => {
    const data = {};
    FORUMS.forEach(f => { data[f.id] = getMockTopics(f.id); });
    setForumData(data);
    setLastUpdate(new Date());
  }, []);
  
  const allTopics = Object.entries(forumData).flatMap(([id, topics]) => {
    const forum = FORUMS.find(f => f.id === id);
    return topics.map(t => ({ ...t, forum }));
  });
  
  const dramaTopics = allTopics
    .filter(t => t.sentiment.level === 'drama' || t.sentiment.level === 'warning')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#fff', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      padding: '12px 16px'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '10px',
        paddingBottom: '8px',
        borderBottom: '1px solid #eee'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '16px' }}>📡</span>
          <span style={{ fontWeight: 700, fontSize: '14px', color: '#111' }}>Gov Scanner</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {lastUpdate && (
            <span style={{ fontSize: '10px', color: '#bbb' }}>
              {lastUpdate.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={() => setLastUpdate(new Date())}
            style={{
              background: '#f5f5f5',
              border: 'none',
              borderRadius: '3px',
              padding: '3px 8px',
              fontSize: '10px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ↻
          </button>
        </div>
      </div>
      
      {/* Drama Alert Bar */}
      {dramaTopics.length > 0 && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '4px',
          padding: '8px 10px',
          marginBottom: '12px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            marginBottom: '6px'
          }}>
            <span style={{ fontSize: '12px' }}>🚨</span>
            <span style={{ fontWeight: 600, fontSize: '11px', color: '#dc2626' }}>
              {dramaTopics.length} Alerts
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {dramaTopics.slice(0, 3).map((t, idx) => (
              <a
                key={idx}
                href={`${t.forum.url}/t/${t.slug}/${t.id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '11px',
                  textDecoration: 'none',
                  color: '#444'
                }}
              >
                <span style={{ 
                  color: t.forum.color, 
                  fontWeight: 600,
                  fontSize: '10px',
                  width: '50px',
                  flexShrink: 0
                }}>
                  {t.forum.name}
                </span>
                <span style={{ 
                  overflow: 'hidden', 
                  textOverflow: 'ellipsis', 
                  whiteSpace: 'nowrap' 
                }}>
                  {t.title}
                </span>
              </a>
            ))}
          </div>
        </div>
      )}
      
      {/* Forum Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px'
      }}>
        {FORUMS.map(forum => (
          <ForumSection 
            key={forum.id} 
            forum={forum} 
            topics={forumData[forum.id] || []} 
          />
        ))}
      </div>
      
      {/* Footer Legend */}
      <div style={{
        marginTop: '12px',
        paddingTop: '8px',
        borderTop: '1px solid #eee',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontSize: '10px',
        color: '#999'
      }}>
        <span>🔥 Drama</span>
        <span>⚠️ Watch</span>
        <span>🗳️ Vote</span>
      </div>
    </div>
  );
}
