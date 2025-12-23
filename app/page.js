'use client';

import { useState, useEffect } from 'react';

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
      { id: 1, slug: 'a', title: '[ARFC] Risk Parameter Updates - Polygon v3', posts_count: 23, views: 1205, created_at: new Date(Date.now() - 3600000).toISOString() },
      { id: 2, slug: 'b', title: 'Emergency Response to Oracle Manipulation Attempt', posts_count: 89, views: 4520, created_at: new Date(Date.now() - 7200000).toISOString() },
      { id: 3, slug: 'c', title: '[TEMP CHECK] Add weETH as Collateral', posts_count: 45, views: 2100, created_at: new Date(Date.now() - 14400000).toISOString() },
    ],
    lido: [
      { id: 1, slug: 'a', title: 'Concerns about validator concentration risk', posts_count: 156, views: 8900, created_at: new Date(Date.now() - 1800000).toISOString() },
      { id: 2, slug: 'b', title: '[LIP-XX] stETH withdrawal queue optimization', posts_count: 34, views: 1800, created_at: new Date(Date.now() - 5400000).toISOString() },
      { id: 3, slug: 'c', title: 'Snapshot Vote: Treasury Diversification', posts_count: 67, views: 3400, created_at: new Date(Date.now() - 10800000).toISOString() },
    ],
    eigenlayer: [
      { id: 1, slug: 'a', title: 'EIGEN Token Incentives Proposal', posts_count: 234, views: 12500, created_at: new Date(Date.now() - 900000).toISOString() },
      { id: 2, slug: 'b', title: 'AVS Security Requirements Discussion', posts_count: 89, views: 5600, created_at: new Date(Date.now() - 3600000).toISOString() },
      { id: 3, slug: 'c', title: 'Slashing Parameters Update', posts_count: 156, views: 8200, created_at: new Date(Date.now() - 7200000).toISOString() },
    ],
    ethena: [
      { id: 1, slug: 'a', title: 'USDe Backing Transparency Report', posts_count: 178, views: 9800, created_at: new Date(Date.now() - 1200000).toISOString() },
      { id: 2, slug: 'b', title: '[RFC] sUSDe Yield Distribution', posts_count: 89, views: 4500, created_at: new Date(Date.now() - 4800000).toISOString() },
      { id: 3, slug: 'c', title: 'Risk Framework for Negative Funding', posts_count: 234, views: 11200, created_at: new Date(Date.now() - 9600000).toISOString() },
    ],
    pendle: [
      { id: 1, slug: 'a', title: 'vePENDLE Gauge Weights - Week 52', posts_count: 45, views: 2300, created_at: new Date(Date.now() - 2400000).toISOString() },
      { id: 2, slug: 'b', title: 'New PT/YT Markets: EigenLayer Assets', posts_count: 67, views: 3800, created_at: new Date(Date.now() - 7200000).toISOString() },
      { id: 3, slug: 'c', title: 'Boros Launch Discussion', posts_count: 123, views: 6700, created_at: new Date(Date.now() - 14400000).toISOString() },
    ],
    sky: [
      { id: 1, slug: 'a', title: 'Executive Vote: Stability Fee Adjustment', posts_count: 89, views: 4500, created_at: new Date(Date.now() - 5400000).toISOString() },
      { id: 2, slug: 'b', title: 'Governance Attack Prevention Framework', posts_count: 234, views: 12300, created_at: new Date(Date.now() - 1800000).toISOString() },
      { id: 3, slug: 'c', title: 'SKY Token Migration Deadline', posts_count: 156, views: 8900, created_at: new Date(Date.now() - 7200000).toISOString() },
    ],
    morpho: [
      { id: 1, slug: 'a', title: 'New Vault: Steakhouse USDC', posts_count: 34, views: 1800, created_at: new Date(Date.now() - 3600000).toISOString() },
      { id: 2, slug: 'b', title: 'Risk Assessment: PT Collateral', posts_count: 78, views: 4200, created_at: new Date(Date.now() - 10800000).toISOString() },
      { id: 3, slug: 'c', title: 'MORPHO Token Distribution', posts_count: 145, views: 7800, created_at: new Date(Date.now() - 21600000).toISOString() },
    ],
    curve: [
      { id: 1, slug: 'a', title: '🚨 URGENT: Vyper Exploit Post-Mortem', posts_count: 234, views: 15600, created_at: new Date(Date.now() - 900000).toISOString() },
      { id: 2, slug: 'b', title: '[PROPOSAL] Compensation Plan for Affected LPs', posts_count: 189, views: 9800, created_at: new Date(Date.now() - 3600000).toISOString() },
      { id: 3, slug: 'c', title: 'Gauge Weight Vote - Week 52', posts_count: 23, views: 890, created_at: new Date(Date.now() - 21600000).toISOString() },
    ],
    uniswap: [
      { id: 1, slug: 'a', title: '[RFC] Fee Switch Activation - Final Discussion', posts_count: 456, views: 23400, created_at: new Date(Date.now() - 2700000).toISOString() },
      { id: 2, slug: 'b', title: 'Cross-chain Expansion Strategy', posts_count: 78, views: 4500, created_at: new Date(Date.now() - 9000000).toISOString() },
      { id: 3, slug: 'c', title: 'V4 Hook Security Framework', posts_count: 56, views: 3200, created_at: new Date(Date.now() - 36000000).toISOString() },
    ],
    compound: [
      { id: 1, slug: 'a', title: 'Gauntlet Risk Parameter Recommendations', posts_count: 45, views: 2300, created_at: new Date(Date.now() - 4500000).toISOString() },
      { id: 2, slug: 'b', title: 'Warning: Large whale accumulating COMP', posts_count: 123, views: 7800, created_at: new Date(Date.now() - 1200000).toISOString() },
      { id: 3, slug: 'c', title: 'Compound III Migration Timeline', posts_count: 67, views: 3400, created_at: new Date(Date.now() - 14400000).toISOString() },
    ],
    euler: [
      { id: 1, slug: 'a', title: 'Euler Yield: New PT Markets', posts_count: 56, views: 2800, created_at: new Date(Date.now() - 3600000).toISOString() },
      { id: 2, slug: 'b', title: 'Risk Parameters Update', posts_count: 34, views: 1600, created_at: new Date(Date.now() - 10800000).toISOString() },
      { id: 3, slug: 'c', title: 'EUL Incentives Program', posts_count: 89, views: 4500, created_at: new Date(Date.now() - 21600000).toISOString() },
    ],
    gmx: [
      { id: 1, slug: 'a', title: 'GMSOL Proposal: Solana Deployment', posts_count: 189, views: 9800, created_at: new Date(Date.now() - 1800000).toISOString() },
      { id: 2, slug: 'b', title: 'GMX V2 Fee Distribution', posts_count: 78, views: 4200, created_at: new Date(Date.now() - 7200000).toISOString() },
      { id: 3, slug: 'c', title: 'New Markets: BTC, ETH Pairs', posts_count: 45, views: 2100, created_at: new Date(Date.now() - 14400000).toISOString() },
    ],
    dydx: [
      { id: 1, slug: 'a', title: 'dYdX Chain Validator Set Expansion', posts_count: 67, views: 3400, created_at: new Date(Date.now() - 3600000).toISOString() },
      { id: 2, slug: 'b', title: 'Trading Rewards Program Update', posts_count: 123, views: 6700, created_at: new Date(Date.now() - 10800000).toISOString() },
      { id: 3, slug: 'c', title: 'Security Incident Response', posts_count: 234, views: 12300, created_at: new Date(Date.now() - 900000).toISOString() },
    ],
    frax: [
      { id: 1, slug: 'a', title: 'FIP-XXX: frxETH V2 Launch', posts_count: 89, views: 4500, created_at: new Date(Date.now() - 5400000).toISOString() },
      { id: 2, slug: 'b', title: 'Fraxtal Chain Incentives', posts_count: 56, views: 2800, created_at: new Date(Date.now() - 14400000).toISOString() },
      { id: 3, slug: 'c', title: 'veFXS Gauge Voting', posts_count: 34, views: 1600, created_at: new Date(Date.now() - 28800000).toISOString() },
    ],
    balancer: [
      { id: 1, slug: 'a', title: 'BIP-XXX: veBAL Incentive Rebalancing', posts_count: 78, views: 4200, created_at: new Date(Date.now() - 3600000).toISOString() },
      { id: 2, slug: 'b', title: 'V3 reCLAMM Pool Launch', posts_count: 45, views: 2300, created_at: new Date(Date.now() - 10800000).toISOString() },
      { id: 3, slug: 'c', title: 'Governance Attack Concerns', posts_count: 156, views: 8900, created_at: new Date(Date.now() - 1200000).toISOString() },
    ],
    maple: [
      { id: 1, slug: 'a', title: 'Syrup USDC Yield Strategy', posts_count: 45, views: 2300, created_at: new Date(Date.now() - 5400000).toISOString() },
      { id: 2, slug: 'b', title: 'Pool Delegate Applications', posts_count: 23, views: 1100, created_at: new Date(Date.now() - 14400000).toISOString() },
      { id: 3, slug: 'c', title: 'Treasury Update Q4', posts_count: 34, views: 1600, created_at: new Date(Date.now() - 28800000).toISOString() },
    ],
    arbitrum: [
      { id: 1, slug: 'a', title: '[AIP-XX] Sequencer Revenue Distribution', posts_count: 78, views: 5600, created_at: new Date(Date.now() - 3600000).toISOString() },
      { id: 2, slug: 'b', title: 'Controversy: Foundation Multi-sig Actions', posts_count: 345, views: 18900, created_at: new Date(Date.now() - 600000).toISOString() },
      { id: 3, slug: 'c', title: 'STIP Round 2 - Project Allocations', posts_count: 123, views: 7800, created_at: new Date(Date.now() - 10800000).toISOString() },
    ],
    optimism: [
      { id: 1, slug: 'a', title: '[PROPOSAL] RetroPGF Round 4 Design', posts_count: 234, views: 12300, created_at: new Date(Date.now() - 4500000).toISOString() },
      { id: 2, slug: 'b', title: 'Delegate Accountability Framework', posts_count: 89, views: 4500, created_at: new Date(Date.now() - 9000000).toISOString() },
      { id: 3, slug: 'c', title: 'Superchain Expansion Roadmap', posts_count: 56, views: 3100, created_at: new Date(Date.now() - 28800000).toISOString() },
    ],
    mantle: [
      { id: 1, slug: 'a', title: 'MIP-30: cMETH Restaking Launch', posts_count: 67, views: 3400, created_at: new Date(Date.now() - 5400000).toISOString() },
      { id: 2, slug: 'b', title: 'mETH Double-Dose Drive', posts_count: 45, views: 2300, created_at: new Date(Date.now() - 14400000).toISOString() },
      { id: 3, slug: 'c', title: 'Treasury Allocation Vote', posts_count: 89, views: 4500, created_at: new Date(Date.now() - 21600000).toISOString() },
    ],
    sui: [
      { id: 1, slug: 'a', title: 'SUI Staking Rewards Discussion', posts_count: 123, views: 6700, created_at: new Date(Date.now() - 3600000).toISOString() },
      { id: 2, slug: 'b', title: 'Developer Grant Program Update', posts_count: 56, views: 2800, created_at: new Date(Date.now() - 10800000).toISOString() },
      { id: 3, slug: 'c', title: 'Validator Set Changes', posts_count: 78, views: 4200, created_at: new Date(Date.now() - 21600000).toISOString() },
    ],
    aptos: [
      { id: 1, slug: 'a', title: 'AIP-XX: Gas Fee Adjustment', posts_count: 89, views: 4500, created_at: new Date(Date.now() - 5400000).toISOString() },
      { id: 2, slug: 'b', title: 'Shardines Execution Engine', posts_count: 145, views: 7800, created_at: new Date(Date.now() - 14400000).toISOString() },
      { id: 3, slug: 'c', title: 'Ecosystem Fund Allocation', posts_count: 67, views: 3400, created_at: new Date(Date.now() - 28800000).toISOString() },
    ],
    plasma: [
      { id: 1, slug: 'a', title: 'XPL Staking Parameters Launch', posts_count: 156, views: 8900, created_at: new Date(Date.now() - 2400000).toISOString() },
      { id: 2, slug: 'b', title: 'Zero-Fee USDT Integration', posts_count: 89, views: 4500, created_at: new Date(Date.now() - 7200000).toISOString() },
      { id: 3, slug: 'c', title: 'DeFi Partner Onboarding: Aave, Euler', posts_count: 67, views: 3400, created_at: new Date(Date.now() - 14400000).toISOString() },
    ],
    jupiter: [
      { id: 1, slug: 'a', title: 'JUP DAO Voting Power Controversy', posts_count: 345, views: 18900, created_at: new Date(Date.now() - 600000).toISOString() },
      { id: 2, slug: 'b', title: 'Jupuary 2025 Airdrop Allocation', posts_count: 567, views: 34500, created_at: new Date(Date.now() - 3600000).toISOString() },
      { id: 3, slug: 'c', title: 'Ultra V3 Trading Engine', posts_count: 123, views: 6700, created_at: new Date(Date.now() - 14400000).toISOString() },
    ],
    kamino: [
      { id: 1, slug: 'a', title: 'Kamino Lend V2 Launch', posts_count: 89, views: 4500, created_at: new Date(Date.now() - 3600000).toISOString() },
      { id: 2, slug: 'b', title: 'SyrupUSDC Integration', posts_count: 56, views: 2800, created_at: new Date(Date.now() - 10800000).toISOString() },
      { id: 3, slug: 'c', title: 'Risk Parameters Update', posts_count: 45, views: 2100, created_at: new Date(Date.now() - 21600000).toISOString() },
    ],
    raydium: [
      { id: 1, slug: 'a', title: 'RAY Staking Rewards Update', posts_count: 78, views: 4200, created_at: new Date(Date.now() - 5400000).toISOString() },
      { id: 2, slug: 'b', title: 'V3 CLMM Pools Launch', posts_count: 45, views: 2300, created_at: new Date(Date.now() - 14400000).toISOString() },
      { id: 3, slug: 'c', title: 'AcceleRaytor IDO Updates', posts_count: 34, views: 1600, created_at: new Date(Date.now() - 28800000).toISOString() },
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
  const [filter, setFilter] = useState('all');
  const { width } = useWindowSize();
  
  // Responsive columns: 6 -> 4 -> 3 -> 2 -> 1
  const getColumns = () => {
    if (width < 480) return 1;
    if (width < 768) return 2;
    if (width < 1024) return 3;
    if (width < 1400) return 4;
    return 5;
  };
  
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

  const categories = [...new Set(FORUMS.map(f => f.cat))];
  const filteredForums = filter === 'all' ? FORUMS : FORUMS.filter(f => f.cat === filter);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#fff', 
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      padding: width < 768 ? '10px' : '12px 20px',
      maxWidth: '1600px',
      margin: '0 auto'
    }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        marginBottom: '8px',
        paddingBottom: '8px',
        borderBottom: '1px solid #eee',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '18px' }}>📡</span>
          <span style={{ fontWeight: 700, fontSize: '16px', color: '#111' }}>Gov Scanner</span>
          <span style={{ fontSize: '11px', color: '#999' }}>{FORUMS.length} protocols</span>
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
              background: '#f5f5f5',
              border: 'none',
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
            background: filter === 'all' ? '#111' : '#f5f5f5',
            color: filter === 'all' ? '#fff' : '#666',
            border: 'none',
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
              background: filter === cat ? CATEGORY_COLORS[cat] : '#f5f5f5',
              color: filter === cat ? '#fff' : CATEGORY_COLORS[cat],
              border: 'none',
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
          borderRadius: '6px',
          padding: '10px 12px',
          marginBottom: '12px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '6px',
            marginBottom: '6px'
          }}>
            <span style={{ fontSize: '14px' }}>🚨</span>
            <span style={{ fontWeight: 600, fontSize: '13px', color: '#dc2626' }}>
              {dramaTopics.length} Alerts
            </span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {dramaTopics.slice(0, 4).map((t, idx) => (
              <a
                key={idx}
                href={`${t.forum.url}/t/${t.slug}/${t.id}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '12px',
                  textDecoration: 'none',
                  color: '#444'
                }}
              >
                <span style={{ 
                  color: t.forum.color, 
                  fontWeight: 600,
                  fontSize: '11px',
                  width: '70px',
                  flexShrink: 0
                }}>
                  {t.forum.name}
                </span>
                <span style={{ 
                  background: CATEGORY_COLORS[t.forum.cat] + '20',
                  color: CATEGORY_COLORS[t.forum.cat],
                  fontSize: '9px',
                  padding: '1px 4px',
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
      
      {/* Forum Grid - Responsive columns */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${getColumns()}, 1fr)`,
        gap: '16px'
      }}>
        {filteredForums.map(forum => (
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
        paddingTop: '10px',
        borderTop: '1px solid #eee',
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
  );
}
