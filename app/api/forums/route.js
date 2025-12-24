// API route to fetch latest topics from governance forums
// Only forums that allow API access are included

const FORUM_APIS = [
  // Major L2s & Chains
  { id: 'arbitrum', url: 'https://forum.arbitrum.foundation/latest.json', name: 'Arbitrum', color: '#28A0F0' },
  { id: 'scroll', url: 'https://forum.scroll.io/latest.json', name: 'Scroll', color: '#FFDBB0' },
  { id: 'monad', url: 'https://forum.monad.xyz/latest.json', name: 'Monad', color: '#836EF9' },
  // DeFi Protocols
  { id: 'compound', url: 'https://www.comp.xyz/latest.json', name: 'Compound', color: '#00D395' },
  { id: 'safe', url: 'https://forum.safe.global/latest.json', name: 'Safe', color: '#12FF80' },
  { id: 'euler', url: 'https://forum.euler.finance/latest.json', name: 'Euler', color: '#E5473D' },
  { id: 'morpho', url: 'https://forum.morpho.org/latest.json', name: 'Morpho', color: '#2470FF' },
  { id: 'cow', url: 'https://forum.cow.fi/latest.json', name: 'CoW Protocol', color: '#194D05' },
  { id: 'angle', url: 'https://gov.angle.money/latest.json', name: 'Angle', color: '#FF6B4A' },
  // Infrastructure & Bridges
  { id: 'thegraph', url: 'https://forum.thegraph.com/latest.json', name: 'The Graph', color: '#6747ED' },
  { id: 'across', url: 'https://forum.across.to/latest.json', name: 'Across', color: '#6CF9D8' },
  { id: 'connext', url: 'https://forum.connext.network/latest.json', name: 'Connext', color: '#8B5CF6' },
  { id: 'radworks', url: 'https://community.radworks.org/latest.json', name: 'Radworks', color: '#FF55FF' },
  // Cosmos Ecosystem
  { id: 'osmosis', url: 'https://forum.osmosis.zone/latest.json', name: 'Osmosis', color: '#5E12A0' },
];

async function fetchForum(forum) {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    
    const response = await fetch(forum.url, {
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
      },
    });
    
    clearTimeout(timeout);
    
    if (!response.ok) {
      return { id: forum.id, topics: [], error: 'Access denied' };
    }
    
    const data = await response.json();
    const baseUrl = forum.url.replace('/latest.json', '');
    
    const topics = (data.topic_list?.topics || [])
      .filter(t => !t.pinned && !t.pinned_globally)
      .slice(0, 3)
      .map(t => ({
        id: t.id,
        slug: t.slug,
        title: t.title,
        posts_count: t.posts_count,
        views: t.views,
        bumped_at: t.bumped_at,
        url: `${baseUrl}/t/${t.slug}/${t.id}`,
      }));
    
    return { 
      id: forum.id, 
      name: forum.name, 
      color: forum.color,
      topics, 
      baseUrl,
      live: true 
    };
  } catch (error) {
    return { id: forum.id, name: forum.name, topics: [], error: error.message, live: false };
  }
}

export async function GET() {
  const results = await Promise.all(FORUM_APIS.map(fetchForum));
  
  return Response.json({
    forums: results,
    timestamp: new Date().toISOString(),
  });
}
