// API route to fetch latest topics from governance forums
// Only forums that allow API access are included

const FORUM_APIS = [
  { id: 'arbitrum', url: 'https://forum.arbitrum.foundation/latest.json', name: 'Arbitrum', color: '#28A0F0' },
  { id: 'compound', url: 'https://www.comp.xyz/latest.json', name: 'Compound', color: '#00D395' },
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
      .slice(0, 5)
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
