'use client';

import { useState, useEffect, useMemo } from 'react';

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

// Snapshot spaces for our protocols (only ones that actually use Snapshot)
const SNAPSHOT_SPACES = [
  { id: 'aavedao.eth', name: 'Aave DAO', color: '#B6509E' },
  { id: 'lido-snapshot.eth', name: 'Lido', color: '#00A3FF' },
  { id: 'uniswapgovernance.eth', name: 'Uniswap', color: '#FF007A' },
  { id: 'arbitrumfoundation.eth', name: 'Arbitrum', color: '#28A0F0' },
  { id: 'opcollective.eth', name: 'Optimism', color: '#FF0420' },
  { id: 'ens.eth', name: 'ENS', color: '#5298FF' },
  { id: 'gitcoindao.eth', name: 'Gitcoin', color: '#0FCE7C' },
  { id: 'safe.eth', name: 'Safe', color: '#12FF80' },
  { id: 'balancer.eth', name: 'Balancer', color: '#1E1E1E' },
  { id: 'curve.eth', name: 'Curve', color: '#FF6B6B' },
  { id: 'frax.eth', name: 'Frax', color: '#000000' },
  { id: 'gmx.eth', name: 'GMX', color: '#4B7BEC' },
  { id: 'morpho.eth', name: 'Morpho', color: '#2470FF' },
  { id: 'dydxgov.eth', name: 'dYdX', color: '#6966FF' },
  { id: 'apecoin.eth', name: 'ApeCoin', color: '#0052FF' },
  { id: 'comp-vote.eth', name: 'Compound', color: '#00D395' },
  { id: 'sushigov.eth', name: 'Sushi', color: '#FA52A0' },
  { id: '1inch.eth', name: '1inch', color: '#1B314F' },
  { id: 'snapshot.dcl.eth', name: 'Decentraland', color: '#FF2D55' },
  { id: 'stgdao.eth', name: 'Stargate', color: '#000000' },
  // Note: Pendle, EigenLayer, Mantle, Ethena, Jupiter use their own governance systems
];

// Categories: Lending, DEX, Staking, L2, Perp, Yield, Stable, Chain
const FORUMS = [
  // === TIER 1: Major DeFi ($10B+ TVL) ===
  { id: 'lido', name: 'Lido', url: 'https://research.lido.fi', color: '#00A3FF', token: 'LDO', cat: 'Staking', tier: 1 },
  { id: 'aave', name: 'Aave', url: 'https://governance.aave.com', color: '#B6509E', token: 'AAVE', cat: 'Lending', tier: 1 },
  { id: 'eigenlayer', name: 'EigenLayer', url: 'https://forum.eigenlayer.xyz', color: '#6366F1', token: 'EIGEN', cat: 'Restaking', tier: 1 },
  
  // === TIER 2: Major DeFi ($2-10B TVL) ===
  { id: 'ethena', name: 'Ethena', url: 'https://gov.ethenafoundation.com', color: '#000000', token: 'ENA', cat: 'Stable', tier: 2 },
  { id: 'uniswap', name: 'Uniswap', url: 'https://gov.uniswap.org', color: '#FF007A', token: 'UNI', cat: 'DEX', tier: 2 },
  { id: 'pendle', name: 'Pendle', url: 'https://snapshot.org/#/pendle-finance.eth', color: '#0DB2AC', token: 'PENDLE', cat: 'Yield', tier: 2 },
  { id: 'sky', name: 'Sky', url: 'https://forum.sky.money', color: '#1AAB9B', token: 'SKY', cat: 'Stable', tier: 2 },
  { id: 'morpho', name: 'Morpho', url: 'https://forum.morpho.org', color: '#2470FF', token: 'MORPHO', cat: 'Lending', tier: 2 },
  
  // === TIER 3: Important DeFi ($500M-2B TVL) ===
  { id: 'curve', name: 'Curve', url: 'https://gov.curve.fi', color: '#FF6B6B', token: 'CRV', cat: 'DEX', tier: 3 },
  { id: 'compound', name: 'Compound', url: 'https://www.comp.xyz', color: '#00D395', token: 'COMP', cat: 'Lending', tier: 3 },
  { id: 'euler', name: 'Euler', url: 'https://forum.euler.finance', color: '#4752C4', token: 'EUL', cat: 'Lending', tier: 3 },
  { id: 'gmx', name: 'GMX', url: 'https://gov.gmx.io', color: '#4B7BEC', token: 'GMX', cat: 'Perp', tier: 3 },
  { id: 'frax', name: 'Frax', url: 'https://gov.frax.finance', color: '#000000', token: 'FXS', cat: 'Stable', tier: 3 },
  { id: 'balancer', name: 'Balancer', url: 'https://forum.balancer.fi', color: '#1E1E1E', token: 'BAL', cat: 'DEX', tier: 3 },
  { id: 'dydx', name: 'dYdX', url: 'https://dydx.forum', color: '#6966FF', token: 'DYDX', cat: 'Perp', tier: 3 },
  { id: 'maple', name: 'Maple', url: 'https://community.maple.finance', color: '#FF6B4A', token: 'MPL', cat: 'Lending', tier: 3 },
  
  // === L2 Chains ===
  { id: 'arbitrum', name: 'Arbitrum', url: 'https://forum.arbitrum.foundation', color: '#28A0F0', token: 'ARB', cat: 'L2', tier: 2 },
  { id: 'optimism', name: 'Optimism', url: 'https://gov.optimism.io', color: '#FF0420', token: 'OP', cat: 'L2', tier: 2 },
  { id: 'mantle', name: 'Mantle', url: 'https://forum.mantle.xyz', color: '#000000', token: 'MNT', cat: 'L2', tier: 3 },
  
  // === Alt L1 Chains ===
  { id: 'sui', name: 'Sui', url: 'https://forums.sui.io', color: '#4DA2FF', token: 'SUI', cat: 'L1', tier: 2 },
  { id: 'aptos', name: 'Aptos', url: 'https://forum.aptoslabs.com', color: '#2DD8A3', token: 'APT', cat: 'L1', tier: 2 },
  { id: 'plasma', name: 'Plasma', url: 'https://plasma.to', color: '#7C3AED', token: 'XPL', cat: 'L1', tier: 3 },
  
  // === Solana DeFi ===
  { id: 'jupiter', name: 'Jupiter', url: 'https://vote.jup.ag', color: '#C7F284', token: 'JUP', cat: 'DEX', tier: 2 },
  { id: 'kamino', name: 'Kamino', url: 'https://gov.kamino.finance', color: '#14F195', token: 'KMNO', cat: 'Lending', tier: 3 },
  { id: 'raydium', name: 'Raydium', url: 'https://raydium.io', color: '#58E7F0', token: 'RAY', cat: 'DEX', tier: 3 },
];

const CATEGORY_COLORS = {
  'Lending': '#22C55E',
  'DEX': '#F59E0B', 
  'Staking': '#3B82F6',
  'Restaking': '#8B5CF6',
  'Stable': '#6B7280',
  'Yield': '#EC4899',
  'Perp': '#EF4444',
  'L2': '#06B6D4',
  'L1': '#14B8A6',
};

const DRAMA_KEYWORDS = ['urgent', 'emergency', 'hack', 'exploit', 'vulnerability', 'attack', 'dump', 'concern', 'risk', 'warning', 'critical', 'bug', 'dispute', 'controversy', 'conflict', 'failed', 'reject', 'manipulation', 'whale', 'governance attack', 'compensation', 'lawsuit', 'legal', 'fork', 'resign', 'removed', 'security', 'incident'];
const HOT_KEYWORDS = ['proposal', 'vote', 'snapshot', 'quorum', 'passed', 'approved', 'upgrade', 'airdrop', 'incentive', 'grant', 'temperature check', 'rfc', 'arfc', 'aip', 'lip', 'mip', 'fip', 'bip'];

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
      { id: 1, slug: 'arfc-aave-token-alignment', title: '🔥 [ARFC] AAVE Token Alignment Phase 1 – Ownership (VOTE LIVE)', posts_count: 312, views: 28500, timeAgo: '30m' },
      { id: 2, slug: 'b', title: '⚠️ Labs Unilaterally Pushed Vote - Author Denounces', posts_count: 189, views: 15200, timeAgo: '1h' },
      { id: 3, slug: 'c', title: 'Whale Dumps $38M AAVE Amid Governance Crisis', posts_count: 234, views: 19800, timeAgo: '2h' },
    ],
    lido: [
      { id: 1, slug: 'a', title: 'Concerns about validator concentration risk', posts_count: 156, views: 8900, timeAgo: '30m' },
      { id: 2, slug: 'b', title: '[LIP-XX] stETH withdrawal queue optimization', posts_count: 34, views: 1800, timeAgo: '1h' },
      { id: 3, slug: 'c', title: 'Snapshot Vote: Treasury Diversification', posts_count: 67, views: 3400, timeAgo: '3h' },
    ],
    eigenlayer: [
      { id: 1, slug: 'a', title: 'EIGEN Token Incentives Proposal', posts_count: 234, views: 12500, timeAgo: '15m' },
      { id: 2, slug: 'b', title: 'AVS Security Requirements Discussion', posts_count: 89, views: 5600, timeAgo: '1h' },
      { id: 3, slug: 'c', title: 'Slashing Parameters Update', posts_count: 156, views: 8200, timeAgo: '2h' },
    ],
    ethena: [
      { id: 1, slug: 'a', title: 'USDe Backing Transparency Report', posts_count: 178, views: 9800, timeAgo: '20m' },
      { id: 2, slug: 'b', title: '[RFC] sUSDe Yield Distribution', posts_count: 89, views: 4500, timeAgo: '1h' },
      { id: 3, slug: 'c', title: 'Risk Framework for Negative Funding', posts_count: 234, views: 11200, timeAgo: '3h' },
    ],
    pendle: [
      { id: 1, slug: 'a', title: 'vePENDLE Gauge Weights - Week 52', posts_count: 45, views: 2300, timeAgo: '40m' },
      { id: 2, slug: 'b', title: 'New PT/YT Markets: EigenLayer Assets', posts_count: 67, views: 3800, timeAgo: '2h' },
      { id: 3, slug: 'c', title: 'Boros Launch Discussion', posts_count: 123, views: 6700, timeAgo: '4h' },
    ],
    sky: [
      { id: 1, slug: 'a', title: 'Executive Vote: Stability Fee Adjustment', posts_count: 89, views: 4500, timeAgo: '1h' },
      { id: 2, slug: 'b', title: 'Governance Attack Prevention Framework', posts_count: 234, views: 12300, timeAgo: '30m' },
      { id: 3, slug: 'c', title: 'SKY Token Migration Deadline', posts_count: 156, views: 8900, timeAgo: '2h' },
    ],
    morpho: [
      { id: 1, slug: 'a', title: 'New Vault: Steakhouse USDC', posts_count: 34, views: 1800, timeAgo: '1h' },
      { id: 2, slug: 'b', title: 'Risk Assessment: PT Collateral', posts_count: 78, views: 4200, timeAgo: '3h' },
      { id: 3, slug: 'c', title: 'MORPHO Token Distribution', posts_count: 145, views: 7800, timeAgo: '6h' },
    ],
    curve: [
      { id: 1, slug: 'a', title: '🚨 URGENT: Vyper Exploit Post-Mortem', posts_count: 234, views: 15600, timeAgo: '15m' },
      { id: 2, slug: 'b', title: '[PROPOSAL] Compensation Plan for Affected LPs', posts_count: 189, views: 9800, timeAgo: '1h' },
      { id: 3, slug: 'c', title: 'Gauge Weight Vote - Week 52', posts_count: 23, views: 890, timeAgo: '6h' },
    ],
    uniswap: [
      { id: 1, slug: 'a', title: '[RFC] Fee Switch Activation - Final Discussion', posts_count: 456, views: 23400, timeAgo: '45m' },
      { id: 2, slug: 'b', title: 'Cross-chain Expansion Strategy', posts_count: 78, views: 4500, timeAgo: '2h' },
      { id: 3, slug: 'c', title: 'V4 Hook Security Framework', posts_count: 56, views: 3200, timeAgo: '10h' },
    ],
    compound: [
      { id: 1, slug: 'a', title: 'Gauntlet Risk Parameter Recommendations', posts_count: 45, views: 2300, timeAgo: '1h' },
      { id: 2, slug: 'b', title: 'Warning: Large whale accumulating COMP', posts_count: 123, views: 7800, timeAgo: '20m' },
      { id: 3, slug: 'c', title: 'Compound III Migration Timeline', posts_count: 67, views: 3400, timeAgo: '4h' },
    ],
    euler: [
      { id: 1, slug: 'a', title: 'Euler Yield: New PT Markets', posts_count: 56, views: 2800, timeAgo: '1h' },
      { id: 2, slug: 'b', title: 'Risk Parameters Update', posts_count: 34, views: 1600, timeAgo: '3h' },
      { id: 3, slug: 'c', title: 'EUL Incentives Program', posts_count: 89, views: 4500, timeAgo: '6h' },
    ],
    gmx: [
      { id: 1, slug: 'a', title: 'GMSOL Proposal: Solana Deployment', posts_count: 189, views: 9800, timeAgo: '30m' },
      { id: 2, slug: 'b', title: 'GMX V2 Fee Distribution', posts_count: 78, views: 4200, timeAgo: '2h' },
      { id: 3, slug: 'c', title: 'New Markets: BTC, ETH Pairs', posts_count: 45, views: 2100, timeAgo: '4h' },
    ],
    dydx: [
      { id: 1, slug: 'a', title: 'dYdX Chain Validator Set Expansion', posts_count: 67, views: 3400, timeAgo: '1h' },
      { id: 2, slug: 'b', title: 'Trading Rewards Program Update', posts_count: 123, views: 6700, timeAgo: '3h' },
      { id: 3, slug: 'c', title: 'Security Incident Response', posts_count: 234, views: 12300, timeAgo: '15m' },
    ],
    frax: [
      { id: 1, slug: 'a', title: 'FIP-XXX: frxETH V2 Launch', posts_count: 89, views: 4500, timeAgo: '1h' },
      { id: 2, slug: 'b', title: 'Fraxtal Chain Incentives', posts_count: 56, views: 2800, timeAgo: '4h' },
      { id: 3, slug: 'c', title: 'veFXS Gauge Voting', posts_count: 34, views: 1600, timeAgo: '8h' },
    ],
    balancer: [
      { id: 1, slug: 'a', title: 'BIP-XXX: veBAL Incentive Rebalancing', posts_count: 78, views: 4200, timeAgo: '1h' },
      { id: 2, slug: 'b', title: 'V3 reCLAMM Pool Launch', posts_count: 45, views: 2300, timeAgo: '3h' },
      { id: 3, slug: 'c', title: 'Governance Attack Concerns', posts_count: 156, views: 8900, timeAgo: '20m' },
    ],
    maple: [
      { id: 1, slug: 'a', title: 'Syrup USDC Yield Strategy', posts_count: 45, views: 2300, timeAgo: '1h' },
      { id: 2, slug: 'b', title: 'Pool Delegate Applications', posts_count: 23, views: 1100, timeAgo: '4h' },
      { id: 3, slug: 'c', title: 'Treasury Update Q4', posts_count: 34, views: 1600, timeAgo: '8h' },
    ],
    arbitrum: [
      { id: 1, slug: 'a', title: '[AIP-XX] Sequencer Revenue Distribution', posts_count: 78, views: 5600, timeAgo: '1h' },
      { id: 2, slug: 'b', title: 'Controversy: Foundation Multi-sig Actions', posts_count: 345, views: 18900, timeAgo: '10m' },
      { id: 3, slug: 'c', title: 'STIP Round 2 - Project Allocations', posts_count: 123, views: 7800, timeAgo: '3h' },
    ],
    optimism: [
      { id: 1, slug: 'a', title: '[PROPOSAL] RetroPGF Round 4 Design', posts_count: 234, views: 12300, timeAgo: '1h' },
      { id: 2, slug: 'b', title: 'Delegate Accountability Framework', posts_count: 89, views: 4500, timeAgo: '2h' },
      { id: 3, slug: 'c', title: 'Superchain Expansion Roadmap', posts_count: 56, views: 3100, timeAgo: '8h' },
    ],
    mantle: [
      { id: 1, slug: 'a', title: 'MIP-30: cMETH Restaking Launch', posts_count: 67, views: 3400, timeAgo: '1h' },
      { id: 2, slug: 'b', title: 'mETH Double-Dose Drive', posts_count: 45, views: 2300, timeAgo: '4h' },
      { id: 3, slug: 'c', title: 'Treasury Allocation Vote', posts_count: 89, views: 4500, timeAgo: '6h' },
    ],
    sui: [
      { id: 1, slug: 'a', title: 'SUI Staking Rewards Discussion', posts_count: 123, views: 6700, timeAgo: '1h' },
      { id: 2, slug: 'b', title: 'Developer Grant Program Update', posts_count: 56, views: 2800, timeAgo: '3h' },
      { id: 3, slug: 'c', title: 'Validator Set Changes', posts_count: 78, views: 4200, timeAgo: '6h' },
    ],
    aptos: [
      { id: 1, slug: 'a', title: 'AIP-XX: Gas Fee Adjustment', posts_count: 89, views: 4500, timeAgo: '1h' },
      { id: 2, slug: 'b', title: 'Shardines Execution Engine', posts_count: 145, views: 7800, timeAgo: '4h' },
      { id: 3, slug: 'c', title: 'Ecosystem Fund Allocation', posts_count: 67, views: 3400, timeAgo: '8h' },
    ],
    plasma: [
      { id: 1, slug: 'a', title: 'XPL Staking Parameters Launch', posts_count: 156, views: 8900, timeAgo: '40m' },
      { id: 2, slug: 'b', title: 'Zero-Fee USDT Integration', posts_count: 89, views: 4500, timeAgo: '2h' },
      { id: 3, slug: 'c', title: 'DeFi Partner Onboarding: Aave, Euler', posts_count: 67, views: 3400, timeAgo: '4h' },
    ],
    jupiter: [
      { id: 1, slug: 'a', title: 'JUP DAO Voting Power Controversy', posts_count: 345, views: 18900, timeAgo: '10m' },
      { id: 2, slug: 'b', title: 'Jupuary 2025 Airdrop Allocation', posts_count: 567, views: 34500, timeAgo: '1h' },
      { id: 3, slug: 'c', title: 'Ultra V3 Trading Engine', posts_count: 123, views: 6700, timeAgo: '4h' },
    ],
    kamino: [
      { id: 1, slug: 'a', title: 'Kamino Lend V2 Launch', posts_count: 89, views: 4500, timeAgo: '1h' },
      { id: 2, slug: 'b', title: 'SyrupUSDC Integration', posts_count: 56, views: 2800, timeAgo: '3h' },
      { id: 3, slug: 'c', title: 'Risk Parameters Update', posts_count: 45, views: 2100, timeAgo: '6h' },
    ],
    raydium: [
      { id: 1, slug: 'a', title: 'RAY Staking Rewards Update', posts_count: 78, views: 4200, timeAgo: '1h' },
      { id: 2, slug: 'b', title: 'V3 CLMM Pools Launch', posts_count: 45, views: 2300, timeAgo: '4h' },
      { id: 3, slug: 'c', title: 'AcceleRaytor IDO Updates', posts_count: 34, views: 1600, timeAgo: '8h' },
    ],
  };
  return (data[forumId] || []).map(t => ({ ...t, sentiment: detectSentiment(t.title) }));
}

function ForumSection({ forum, topics }) {
  const dramaCount = topics.filter(t => t.sentiment.level === 'drama').length;
  const catColor = CATEGORY_COLORS[forum.cat] || '#888';
  
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '5px', 
        marginBottom: '4px',
        paddingBottom: '3px',
        borderBottom: `2px solid ${forum.color}`
      }}>
        {/* Tier indicator */}
        {forum.tier === 1 && <span style={{ fontSize: '10px' }}>⭐</span>}
        
        <span style={{ fontWeight: 600, color: '#111', fontSize: '13px' }}>{forum.name}</span>
        <span style={{ color: '#bbb', fontSize: '11px' }}>${forum.token}</span>
        
        {/* Category badge */}
        <span style={{ 
          background: catColor + '20',
          color: catColor,
          fontSize: '10px', 
          padding: '1px 4px', 
          borderRadius: '3px',
          fontWeight: 500
        }}>
          {forum.cat}
        </span>
        
        {dramaCount > 0 && (
          <span style={{ 
            background: '#fee2e2', 
            color: '#dc2626', 
            fontSize: '10px', 
            padding: '1px 4px', 
            borderRadius: '3px',
            fontWeight: 600
          }}>
            {dramaCount}🔥
          </span>
        )}
        <a 
          href={forum.url} 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ marginLeft: 'auto', color: '#bbb', fontSize: '11px', textDecoration: 'none' }}
        >
          ↗
        </a>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {topics.slice(0, 3).map((topic, idx) => (
          <a
            key={idx}
            href={`${forum.url}/latest`}
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
              <span style={{ fontSize: '11px', flexShrink: 0, width: '14px' }}>{topic.sentiment.tag}</span>
            )}
            {!topic.sentiment.tag && <span style={{ width: '14px', flexShrink: 0 }}></span>}
            <span style={{ 
              flex: 1, 
              fontSize: '12px', 
              color: '#444',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap'
            }}>
              {topic.title}
            </span>
            <span style={{ fontSize: '10px', color: '#bbb', flexShrink: 0 }}>
              {topic.posts_count}
            </span>
            <span style={{ fontSize: '10px', color: forum.color, flexShrink: 0, width: '20px', textAlign: 'right' }}>
              {topic.timeAgo}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

// Snapshot voting component
function SnapshotVotes({ width }) {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');
  const [lastUpdate, setLastUpdate] = useState(null);

  useEffect(() => {
    fetchProposals();
    
    // Auto-refresh every 1 hour (3600000ms)
    const interval = setInterval(() => {
      fetchProposals();
    }, 3600000);
    
    return () => clearInterval(interval);
  }, []);

  // Keywords that indicate controversial/drama proposals
  const DRAMA_PROPOSAL_KEYWORDS = ['alignment', 'takeover', 'hostile', 'emergency', 'urgent', 'dispute', 'controversy'];
  
  const isControversialProposal = (title) => {
    const lowerTitle = title?.toLowerCase() || '';
    return DRAMA_PROPOSAL_KEYWORDS.some(kw => lowerTitle.includes(kw));
  };

  const fetchProposals = async () => {
    setLoading(true);
    setLastUpdate(new Date());
    try {
      const spaceIds = SNAPSHOT_SPACES.map(s => `"${s.id}"`).join(',');
      const query = `
        query {
          proposals(
            first: 50,
            skip: 0,
            where: {
              space_in: [${spaceIds}],
              state: "active"
            },
            orderBy: "end",
            orderDirection: asc
          ) {
            id
            title
            body
            choices
            start
            end
            state
            scores
            scores_total
            quorum
            space {
              id
              name
              voting {
                quorum
                quorumType
              }
            }
            link
          }
        }
      `;
      
      const response = await fetch('https://hub.snapshot.org/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      
      const data = await response.json();
      if (data.data?.proposals && data.data.proposals.length > 0) {
        // Mark controversial proposals
        const proposalsWithFlags = data.data.proposals.map(p => ({
          ...p,
          isControversial: isControversialProposal(p.title)
        }));
        setProposals(proposalsWithFlags);
      } else {
        // Use mock data if no active proposals
        setProposals(getMockProposals());
      }
    } catch (error) {
      console.error('Failed to fetch Snapshot proposals:', error);
      // Use mock data on error
      setProposals(getMockProposals());
    }
    setLoading(false);
  };

  const getMockProposals = () => [
    { id: 'aave-alignment', title: '[ARFC] $AAVE token alignment. Phase 1 - Ownership', space: { id: 'aavedao.eth', name: 'Aave DAO', voting: { quorum: 320000, quorumType: 'default' } }, end: Date.now() + 259200000, scores: [0.008, 158125, 250805], scores_total: 408930, quorum: 320000, choices: ['YAE', 'NAY', 'ABSTAIN'], state: 'active', isControversial: true },
    { id: '2', title: 'LIP-28: Treasury Diversification', space: { id: 'lido-snapshot.eth', name: 'Lido', voting: { quorum: 5000000, quorumType: 'default' } }, end: Date.now() + 172800000, scores: [8000000, 1000000], scores_total: 9000000, quorum: 5000000, choices: ['Yes', 'No'], state: 'active' },
    { id: '3', title: 'Fee Switch Activation Vote', space: { id: 'uniswapgovernance.eth', name: 'Uniswap', voting: { quorum: 40000000, quorumType: 'default' } }, end: Date.now() + 259200000, scores: [45000000, 5000000], scores_total: 50000000, quorum: 40000000, choices: ['Enable', 'Disable'], state: 'active' },
    { id: '4', title: 'AIP-87: Gaming Catalyst Program', space: { id: 'arbitrumfoundation.eth', name: 'Arbitrum', voting: { quorum: 113000000, quorumType: 'approval' } }, end: Date.now() + 345600000, scores: [120000000, 30000000], scores_total: 150000000, quorum: 113000000, choices: ['For', 'Against'], state: 'active' },
    { id: '5', title: 'Delegate Incentive Program S5', space: { id: 'opcollective.eth', name: 'Optimism', voting: { quorum: 30000000, quorumType: 'approval' } }, end: Date.now() + 432000000, scores: [25000000, 8000000], scores_total: 33000000, quorum: 30000000, choices: ['Approve', 'Reject'], state: 'active' },
  ];

  const getTimeRemaining = (endTime) => {
    const diff = endTime - Date.now();
    if (diff < 0) return 'Ended';
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(hours / 24);
    if (days > 0) return `${days}d ${hours % 24}h`;
    return `${hours}h`;
  };

  const getSpaceColor = (spaceId) => {
    const space = SNAPSHOT_SPACES.find(s => s.id === spaceId);
    return space?.color || '#888';
  };

  const getColumns = () => {
    if (width < 600) return 1;
    if (width < 900) return 2;
    return 3;
  };

  if (loading && proposals.length === 0) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
        Loading Snapshot votes...
      </div>
    );
  }

  return (
    <div>
      {/* Header with refresh info */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '12px',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '12px', color: '#999' }}>
            {lastUpdate && `Updated: ${lastUpdate.toLocaleTimeString()}`}
          </span>
          <span style={{ fontSize: '10px', color: '#bbb' }}>
            (auto-refresh: 1h)
          </span>
        </div>
        <button
          onClick={() => fetchProposals()}
          disabled={loading}
          style={{
            background: loading ? '#e5e5e5' : '#fff',
            border: '1px solid #e5e5e5',
            borderRadius: '4px',
            padding: '4px 10px',
            fontSize: '12px',
            cursor: loading ? 'not-allowed' : 'pointer',
            color: '#666',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          {loading ? '⏳' : '↻'} Refresh
        </button>
      </div>

      {/* Filter buttons */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={() => setFilter('active')}
          style={{
            background: filter === 'active' ? '#8B5CF6' : '#f5f5f5',
            color: filter === 'active' ? '#fff' : '#666',
            border: 'none',
            borderRadius: '4px',
            padding: '6px 12px',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          🗳️ Active ({proposals.length})
        </button>
        <button
          onClick={fetchProposals}
          style={{
            background: '#f5f5f5',
            border: 'none',
            borderRadius: '4px',
            padding: '6px 12px',
            fontSize: '12px',
            cursor: 'pointer',
            color: '#666'
          }}
        >
          ↻ Refresh
        </button>
      </div>

      {proposals.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
          No active votes at the moment
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${getColumns()}, 1fr)`,
          gap: '12px',
          width: '100%'
        }}>
          {proposals.map((proposal) => {
            const totalVotes = proposal.scores_total || 0;
            const leadingChoice = proposal.scores?.indexOf(Math.max(...(proposal.scores || [0]))) || 0;
            const leadingPercent = totalVotes > 0 ? ((proposal.scores?.[leadingChoice] || 0) / totalVotes * 100).toFixed(1) : 0;
            const spaceColor = getSpaceColor(proposal.space?.id);
            const endTime = typeof proposal.end === 'number' && proposal.end > 1000000000000 ? proposal.end : proposal.end * 1000;
            const isControversial = proposal.isControversial || proposal.title?.includes('🔥');
            const proposalLink = proposal.link || `https://snapshot.org/#/${proposal.space?.id}/proposal/${proposal.id}`;
            
            return (
              <a
                key={proposal.id}
                href={proposalLink}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'block',
                  background: isControversial ? '#fef2f2' : '#fff',
                  border: isControversial ? '2px solid #fecaca' : '1px solid #e5e5e5',
                  borderRadius: '8px',
                  padding: '12px',
                  textDecoration: 'none',
                  transition: 'border-color 0.2s',
                  minWidth: 0,
                  overflow: 'hidden'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = spaceColor}
                onMouseLeave={e => e.currentTarget.style.borderColor = isControversial ? '#fecaca' : '#e5e5e5'}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span style={{ 
                    background: spaceColor + '20',
                    color: spaceColor,
                    fontSize: '11px',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 600
                  }}>
                    {proposal.space?.name}
                  </span>
                  {isControversial && (
                    <span style={{ 
                      background: '#dc2626',
                      color: '#fff',
                      fontSize: '9px',
                      padding: '2px 5px',
                      borderRadius: '3px',
                      fontWeight: 600
                    }}>
                      🔥 DRAMA
                    </span>
                  )}
                  <span style={{ 
                    marginLeft: 'auto',
                    fontSize: '11px',
                    color: endTime - Date.now() < 86400000 ? '#dc2626' : '#999',
                    fontWeight: endTime - Date.now() < 86400000 ? 600 : 400
                  }}>
                    ⏱️ {getTimeRemaining(endTime)}
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
                  {proposal.title}
                </div>
                
                {/* Progress bar - handle up to 3 choices */}
                <div style={{ marginBottom: '6px' }}>
                  <div style={{ 
                    height: '6px', 
                    background: '#f0f0f0', 
                    borderRadius: '3px',
                    overflow: 'hidden',
                    display: 'flex'
                  }}>
                    {proposal.choices?.slice(0, 3).map((choice, idx) => {
                      const pct = totalVotes > 0 ? (proposal.scores?.[idx] || 0) / totalVotes * 100 : 0;
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
                
                {/* Choices - show up to 3 */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', flexWrap: 'wrap', gap: '4px' }}>
                  {proposal.choices?.slice(0, 3).map((choice, idx) => {
                    const pct = totalVotes > 0 ? (proposal.scores?.[idx] || 0) / totalVotes * 100 : 0;
                    const colors = ['#22C55E', '#EF4444', '#6B7280'];
                    return (
                      <span key={idx} style={{ color: colors[idx] || '#888' }}>
                        {choice}: {pct.toFixed(1)}%
                      </span>
                    );
                  })}
                </div>
                
                {/* Total votes & Quorum */}
                {(() => {
                  const quorum = proposal.quorum || proposal.space?.voting?.quorum || 0;
                  const quorumType = proposal.space?.voting?.quorumType || 'default';
                  // For approval quorum, use first choice (usually Yes/For/YAE)
                  const quorumBase = quorumType === 'approval' ? (proposal.scores?.[0] || 0) : totalVotes;
                  const quorumPercent = quorum > 0 ? (quorumBase / quorum * 100) : 0;
                  const quorumMet = quorum > 0 && quorumBase >= quorum;
                  
                  return (
                    <div style={{ fontSize: '10px', color: '#999', marginTop: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>
                          {totalVotes > 1000000 
                            ? `${(totalVotes/1000000).toFixed(1)}M votes`
                            : totalVotes > 1000 
                            ? `${(totalVotes/1000).toFixed(1)}K votes`
                            : `${totalVotes.toFixed(0)} votes`
                          }
                        </span>
                        {quorum > 0 && (
                          <span style={{ 
                            color: quorumMet ? '#22C55E' : '#F59E0B',
                            fontWeight: 500
                          }}>
                            {quorumMet ? '✓ ' : ''}
                            {quorumPercent.toFixed(0)}% of quorum
                          </span>
                        )}
                      </div>
                      {quorum > 0 && (
                        <div style={{ marginTop: '4px' }}>
                          {/* Quorum progress bar */}
                          <div style={{ 
                            height: '3px', 
                            background: '#e5e5e5', 
                            borderRadius: '2px',
                            overflow: 'hidden',
                            marginBottom: '3px'
                          }}>
                            <div style={{
                              height: '100%',
                              width: `${Math.min(quorumPercent, 100)}%`,
                              background: quorumMet ? '#22C55E' : '#F59E0B',
                            }} />
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: '#bbb' }}>
                            <span>
                              Quorum: {quorum > 1000000 
                                ? `${(quorum/1000000).toFixed(1)}M` 
                                : quorum > 1000 
                                ? `${(quorum/1000).toFixed(0)}K`
                                : quorum.toFixed(0)
                              }
                            </span>
                            <span style={{ fontStyle: 'italic' }}>
                              {quorumType === 'approval' ? '(For votes)' : '(Total votes)'}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  // Initialize forumData directly (not lazy) for SSR compatibility
  const initialForumData = useMemo(() => {
    const data = {};
    FORUMS.forEach(f => { data[f.id] = getMockTopics(f.id); });
    return data;
  }, []);
  
  const [forumData, setForumData] = useState(initialForumData);
  const [liveForums, setLiveForums] = useState([]);
  const [liveLoading, setLiveLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [filter, setFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('forums');
  const { width } = useWindowSize();
  
  // Responsive columns: 4 -> 3 -> 2 -> 1
  const getColumns = () => {
    if (width < 500) return 1;
    if (width < 768) return 2;
    if (width < 1100) return 3;
    return 4;
  };
  
  // Fetch live forum data
  const fetchLiveForums = async () => {
    try {
      const res = await fetch('/api/forums');
      const data = await res.json();
      setLiveForums(data.forums || []);
      setLastUpdate(new Date());
    } catch (err) {
      console.error('Failed to fetch live forums:', err);
    } finally {
      setLiveLoading(false);
    }
  };
  
  useEffect(() => {
    setLastUpdate(new Date());
    fetchLiveForums();
    
    // Refresh every 30 minutes
    const interval = setInterval(fetchLiveForums, 1800000);
    return () => clearInterval(interval);
  }, []);
  
  const allTopics = Object.entries(forumData).flatMap(([id, topics]) => {
    const forum = FORUMS.find(f => f.id === id);
    return topics.map(t => ({ ...t, forum }));
  });
  
  const dramaTopics = allTopics
    .filter(t => t.sentiment.level === 'drama' || t.sentiment.level === 'warning')
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const categories = [...new Set(FORUMS.map(f => f.cat))];
  const filteredForums = filter === 'all' ? FORUMS : FORUMS.filter(f => f.cat === filter);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#fafafa', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      padding: width < 768 ? '10px' : '12px 20px',
      width: '100%',
      maxWidth: '100vw',
      boxSizing: 'border-box',
      overflowX: 'hidden'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        width: '100%'
      }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '12px',
        paddingBottom: '8px',
        borderBottom: '1px solid #e5e5e5',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '20px' }}>📡</span>
          <span style={{ fontWeight: 700, fontSize: '18px', color: '#111' }}>Gov Scanner</span>
          <span style={{ fontSize: '12px', color: '#999' }}>{FORUMS.length} protocols</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {lastUpdate && (
            <span style={{ fontSize: '11px', color: '#bbb' }}>
              {lastUpdate.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={() => setLastUpdate(new Date())}
            style={{
              background: '#fff',
              border: '1px solid #e5e5e5',
              borderRadius: '4px',
              padding: '4px 10px',
              fontSize: '12px',
              cursor: 'pointer',
              color: '#666'
            }}
          >
            ↻
          </button>
        </div>
      </div>

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
        </button>
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
        </button>
      </div>

      {activeTab === 'forums' && (
        <>
          {/* Live Forums Section */}
          {liveForums.length > 0 && (
            <div style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '16px'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                marginBottom: '12px'
              }}>
                <span style={{ 
                  width: '8px', 
                  height: '8px', 
                  background: '#ef4444', 
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }} />
                <span style={{ fontWeight: 600, fontSize: '14px', color: '#fff' }}>
                  Live Updates
                </span>
                <span style={{ fontSize: '11px', color: '#888' }}>
                  Real-time from Discourse API
                </span>
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: width < 768 ? '1fr' : 'repeat(2, 1fr)',
                gap: '12px'
              }}>
                {liveForums.map(forum => (
                  <div key={forum.id} style={{
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    padding: '12px',
                    border: `1px solid ${forum.color}40`
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '8px',
                      marginBottom: '10px'
                    }}>
                      <span style={{ 
                        background: forum.color,
                        color: '#fff',
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
                        style={{ fontSize: '11px', color: '#888', textDecoration: 'none' }}
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
                            padding: '4px 6px',
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '4px',
                            textDecoration: 'none',
                            transition: 'background 0.2s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                        >
                          <span style={{ 
                            flex: 1,
                            fontSize: '12px', 
                            color: '#e5e5e5',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                          }}>
                            {topic.title}
                          </span>
                          <span style={{ fontSize: '10px', color: '#666', flexShrink: 0 }}>
                            💬{topic.posts_count}
                          </span>
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {liveLoading && (
            <div style={{
              background: '#1a1a2e',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '16px',
              textAlign: 'center',
              color: '#888'
            }}>
              Loading live updates...
            </div>
          )}

          {/* Category Filter */}
          <div style={{ 
            display: 'flex', 
            gap: '6px', 
            marginBottom: '12px',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setFilter('all')}
              style={{
                background: filter === 'all' ? '#111' : '#fff',
                color: filter === 'all' ? '#fff' : '#666',
                border: filter === 'all' ? 'none' : '1px solid #e5e5e5',
                borderRadius: '4px',
                padding: '4px 10px',
                fontSize: '11px',
                cursor: 'pointer'
              }}
            >
              All
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  background: filter === cat ? CATEGORY_COLORS[cat] : '#fff',
                  color: filter === cat ? '#fff' : CATEGORY_COLORS[cat],
                  border: filter === cat ? 'none' : '1px solid #e5e5e5',
                  borderRadius: '4px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                {cat}
              </button>
            ))}
          </div>
          
          {/* Drama Alert Bar */}
          {dramaTopics.length > 0 && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '8px',
              padding: '12px 14px',
              marginBottom: '16px'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px',
                marginBottom: '8px'
              }}>
                <span style={{ fontSize: '16px' }}>🚨</span>
                <span style={{ fontWeight: 600, fontSize: '14px', color: '#dc2626' }}>
                  {dramaTopics.length} Alerts
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {dramaTopics.slice(0, 4).map((t, idx) => (
                  <a
                    key={idx}
                    href={`${t.forum.url}/t/${t.slug}/${t.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '13px',
                      textDecoration: 'none',
                      color: '#444'
                    }}
                  >
                    <span style={{ 
                      color: t.forum.color, 
                      fontWeight: 600,
                      fontSize: '12px',
                      width: '75px',
                      flexShrink: 0
                    }}>
                      {t.forum.name}
                    </span>
                    <span style={{ 
                      background: CATEGORY_COLORS[t.forum.cat] + '20',
                      color: CATEGORY_COLORS[t.forum.cat],
                      fontSize: '10px',
                      padding: '1px 5px',
                      borderRadius: '3px',
                      flexShrink: 0
                    }}>
                      {t.forum.cat}
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
            gridTemplateColumns: `repeat(${getColumns()}, 1fr)`,
            gap: '16px',
            width: '100%'
          }}>
            {filteredForums.map(forum => (
              <div
                key={forum.id}
                style={{
                  background: '#fff',
                  borderRadius: '8px',
                  padding: '12px',
                  border: '1px solid #e5e5e5',
                  minWidth: 0,
                  overflow: 'hidden'
                }}
              >
                <ForumSection 
                  forum={forum} 
                  topics={forumData[forum.id] || []} 
                />
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'votes' && (
        <SnapshotVotes width={width} />
      )}
      
      {/* Footer Legend */}
      <div style={{
        marginTop: '16px',
        paddingTop: '12px',
        borderTop: '1px solid #e5e5e5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '11px',
        color: '#999',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <span>🔥 Drama</span>
          <span>⚠️ Watch</span>
          <span>🗳️ Vote</span>
          <span>⭐ Tier 1</span>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {Object.entries(CATEGORY_COLORS).slice(0, 5).map(([cat, color]) => (
            <span key={cat} style={{ color }}>{cat}</span>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
}
