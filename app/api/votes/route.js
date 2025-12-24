// API route to fetch active governance votes from Snapshot
// Tracks major DeFi protocols with active proposals

const SNAPSHOT_API = 'https://hub.snapshot.org/graphql';

// Major DeFi protocol space IDs on Snapshot
const TRACKED_SPACES = [
  // DeFi Blue Chips
  'aave.eth',
  'uniswapgovernance.eth',
  'compound-governance.eth',
  'balancer.eth',
  'curve.eth',
  'cvx.eth',           // Convex
  'frax.eth',
  '1inch.eth',
  'sushigov.eth',
  'yearn-snapshot.eth',
  
  // L2s & Infrastructure  
  'arbitrumfoundation.eth',
  'opcollective.eth',
  'safe.eth',
  'ens.eth',
  'lido-snapshot.eth',
  'stgdao.eth',        // Stargate
  'hop.eth',
  'gmx.eth',
  
  // Growing Protocols
  'gitcoindao.eth',
  'apecoin.eth',
  'rocketpool-dao.eth',
  'aavegotchi.eth',
  'cowdao.eth',
  'pancake',
  'euler.eth',
  'morpho.eth',
  'angle-dao.eth',
  'thegraph.eth',
  'olympusdao.eth',
  'spectradao.eth',
  'aladdindao.eth',
  'streamr.eth',
  'benddao.eth',
  'magicappstore.eth',
];

// GraphQL query for active proposals
const ACTIVE_PROPOSALS_QUERY = `
  query ActiveProposals($spaces: [String!]) {
    proposals(
      first: 100,
      where: { 
        space_in: $spaces,
        state: "active"
      },
      orderBy: "end",
      orderDirection: asc
    ) {
      id
      title
      body
      space {
        id
        name
      }
      state
      start
      end
      choices
      scores
      scores_total
      votes
      quorum
      link
    }
  }
`;

// Query for recent proposals (active + recently closed)
const RECENT_PROPOSALS_QUERY = `
  query RecentProposals($spaces: [String!]) {
    proposals(
      first: 50,
      where: { 
        space_in: $spaces
      },
      orderBy: "created",
      orderDirection: desc
    ) {
      id
      title
      space {
        id
        name
      }
      state
      start
      end
      scores_total
      votes
    }
  }
`;

async function fetchSnapshotProposals(query, spaces) {
  try {
    const response = await fetch(SNAPSHOT_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: { spaces },
      }),
    });

    if (!response.ok) {
      throw new Error(`Snapshot API error: ${response.status}`);
    }

    const data = await response.json();
    return data.data?.proposals || [];
  } catch (error) {
    console.error('Snapshot fetch error:', error);
    return [];
  }
}

// Format time remaining
function formatTimeRemaining(endTimestamp) {
  const now = Math.floor(Date.now() / 1000);
  const diff = endTimestamp - now;
  
  if (diff <= 0) return 'Ended';
  
  const days = Math.floor(diff / 86400);
  const hours = Math.floor((diff % 86400) / 3600);
  
  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h`;
  return `${Math.floor(diff / 60)}m`;
}

// Get vote status
function getVoteStatus(proposal) {
  const now = Math.floor(Date.now() / 1000);
  const end = proposal.end;
  const diff = end - now;
  
  if (diff <= 0) return 'ended';
  if (diff < 86400) return 'ending-soon'; // Less than 24h
  if (diff < 172800) return 'ending-48h'; // Less than 48h
  return 'active';
}

// Determine leading choice
function getLeadingChoice(proposal) {
  if (!proposal.scores || !proposal.choices || proposal.scores.length === 0) {
    return null;
  }
  
  const maxScore = Math.max(...proposal.scores);
  const maxIndex = proposal.scores.indexOf(maxScore);
  
  if (maxScore === 0) return null;
  
  return {
    choice: proposal.choices[maxIndex],
    score: maxScore,
    percentage: proposal.scores_total > 0 
      ? ((maxScore / proposal.scores_total) * 100).toFixed(1)
      : 0,
  };
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const includeRecent = searchParams.get('includeRecent') === 'true';
  
  // Fetch active proposals
  const activeProposals = await fetchSnapshotProposals(ACTIVE_PROPOSALS_QUERY, TRACKED_SPACES);
  
  // Format active proposals
  const formattedActive = activeProposals.map(p => ({
    id: p.id,
    title: p.title,
    space: {
      id: p.space.id,
      name: p.space.name,
    },
    state: p.state,
    status: getVoteStatus(p),
    timeRemaining: formatTimeRemaining(p.end),
    startTime: new Date(p.start * 1000).toISOString(),
    endTime: new Date(p.end * 1000).toISOString(),
    votes: p.votes,
    scores_total: p.scores_total,
    choices: p.choices,
    scores: p.scores,
    leading: getLeadingChoice(p),
    link: p.link || `https://snapshot.org/#/${p.space.id}/proposal/${p.id}`,
  }));
  
  // Sort by urgency (ending soonest first)
  formattedActive.sort((a, b) => new Date(a.endTime) - new Date(b.endTime));
  
  // Group by status
  const grouped = {
    endingSoon: formattedActive.filter(p => p.status === 'ending-soon'),
    ending48h: formattedActive.filter(p => p.status === 'ending-48h'),
    active: formattedActive.filter(p => p.status === 'active'),
  };
  
  // Optionally fetch recent proposals
  let recentProposals = [];
  if (includeRecent) {
    const recent = await fetchSnapshotProposals(RECENT_PROPOSALS_QUERY, TRACKED_SPACES);
    recentProposals = recent
      .filter(p => p.state === 'closed')
      .slice(0, 10)
      .map(p => ({
        id: p.id,
        title: p.title,
        space: p.space,
        state: p.state,
        votes: p.votes,
        scores_total: p.scores_total,
      }));
  }
  
  return Response.json({
    active: formattedActive,
    grouped,
    recent: recentProposals,
    stats: {
      total: formattedActive.length,
      endingSoon: grouped.endingSoon.length,
      ending48h: grouped.ending48h.length,
      spacesTracked: TRACKED_SPACES.length,
    },
    timestamp: new Date().toISOString(),
  });
}
