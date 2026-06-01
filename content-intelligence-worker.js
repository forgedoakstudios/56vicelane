// ============================================================
//  GTA RELEVANCE GATE  (added May 31, 2026)
// ============================================================
const PILLARS = {
  characters: ['jason duval','jason','lucia caminos','lucia','cal hampton','boobie ike',"dre'quan",'real dimez','protagonist','protagonists'],
  map: ['leonida','vice city','vice-city','leonida keys','grassrivers','port gellhorn','ambrosia','mount kalaga','open world','open-world','setting','region','regions','the keys'],
  game: ['gta6','gta 6','gta vi','grand theft auto 6','grand theft auto vi','gta','grand theft auto','gta online','gta v','gta 5','launch','release date','november 19','edition','editions','pre-order','preorder','trailer','gameplay']
};
const ROCKSTAR_TAKETWO = ['rockstar','rockstar games','rockstar north','take-two','take two','take-two interactive','ttwo','strauss zelnick','zelnick','sam houser','dan houser','rockstar developer','rockstar employee'];
const FRANCHISE_NEXUS = ROCKSTAR_TAKETWO.concat(['gta','grand theft auto','gta6','gta 6','gta online','vice city','leonida','red dead','red dead redemption','rdr','rdr2','red dead online']);
const IMPACT = {
  ai: ['artificial intelligence',' ai ','generative ai','ai model','machine learning','ai tool','ai coding','prompt injection','nvidia ai','ai chip'],
  games: ['video game','game launch','game delay','delayed','release window','fable','elder scrolls','open-world game','rival game','launch window','review embargo','review copies'],
  logistics: ['supply chain','chip shortage','semiconductor','memory shortage','gpu shortage','manufacturing','pipeline','disruption','shortage','tariff','factory','production halt','samsung','tsmc','console shortage','shipping','inventory','logistics']
};
function _has(text, terms){ for (var i=0;i<terms.length;i++){ if (text.indexOf(terms[i])!==-1) return true; } return false; }
function gateStory(story){
  var text = ((story.title||'') + ' ' + (story.summary||story.description||'')).toLowerCase();
  var redDead = _has(text, ['red dead','red dead redemption','rdr','rdr2']);
  var franchise = (redDead && !_has(text, ['gta','grand theft auto'])) ? 'RedDead' : 'GTA';
  // Path 1a: Rockstar / Take-Two / staff = auto qualify
  if (_has(text, ROCKSTAR_TAKETWO)) return { pass:true, type:'B', franchise:franchise, score:99, reasons:['Rockstar/Take-Two'] };
  // Path 1b: 2 of 3 pillars
  var reasons=[]; var score=0;
  if (_has(text, PILLARS.characters)){ score++; reasons.push('characters'); }
  if (_has(text, PILLARS.map)){ score++; reasons.push('map'); }
  if (_has(text, PILLARS.game)){ score++; reasons.push('game'); }
  if (score>=2) return { pass:true, type:'B', franchise:franchise, score:score, reasons:reasons };
  // Path 2: industry impact AND franchise nexus
  var impact=[];
  if (_has(text, IMPACT.ai)) impact.push('AI');
  if (_has(text, IMPACT.games)) impact.push('games');
  if (_has(text, IMPACT.logistics)) impact.push('logistics');
  if (impact.length && _has(text, FRANCHISE_NEXUS)) return { pass:true, type:'A', franchise:franchise, score:2, reasons:['industry:'+impact.join('/'),'nexus'] };
  return { pass:false, type:null, franchise:franchise, score:score, reasons:reasons };
}

export default {
  async fetch(req, env) {
    const url = new URL(req.url);

    if (url.pathname === '/clear-cache' && url.searchParams.get('confirm') === 'yes') {
      const list = await env.NEWS_CACHE.list();
      let count = 0;
      for (const k of list.keys) {
        await env.NEWS_CACHE.delete(k.name);
        count++;
      }
      return Response.json({ cleared: count });
    }

    if (url.pathname === '/drafts') {
      const list = await env.DRAFT_QUEUE.list({ prefix: 'draft:' });
      const drafts = [];
      for (const k of list.keys) {
        const val = await env.DRAFT_QUEUE.get(k.name, { type: 'json' });
        if (val) drafts.push({ key: k.name, headline: val.headline, status: val.status, createdAt: val.createdAt });
      }
      return Response.json(drafts);
    }

    if (url.pathname === '/debug-all') {
      const feeds = [
        'https://kotaku.com/tag/grand-theft-auto/rss',
        'https://www.pcgamer.com/rss/',
        'https://www.eurogamer.net/feed'
      ];
      const results = [];
      for (const feedUrl of feeds) {
        try {
          const res = await fetch(feedUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (compatible; 56ViceLaneBot/1.0)' } });
          const text = await res.text();
          const items = parseRSS(text);
          results.push({ url: feedUrl, status: res.status, itemsFound: items.length, firstTitle: items[0] ? items[0].title : 'none' });
        } catch (e) {
          results.push({ url: feedUrl, status: 'error', error: e.message });
        }
      }
      return Response.json(results);
    }

    if (url.pathname === '/test-claude') {
      const result = await testClaude(env);
      return Response.json(result);
    }

    if (url.pathname === '/run') {
      const result = await runPipeline(env);
      return Response.json(result);
    }

    return Response.json({
      status: 'online',
      version: '5.0',
      endpoints: ['/run', '/drafts', '/debug-all', '/test-claude', '/clear-cache?confirm=yes']
    });
  },

  async scheduled(event, env) {
    await runPipeline(env);
  }
};

async function testClaude(env) {
  try {
    const hasKey = env.ANTHROPIC_KEY ? 'yes - length ' + env.ANTHROPIC_KEY.length : 'NO KEY FOUND';
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': env.ANTHROPIC_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 100,
        messages: [{ role: 'user', content: 'Say hello in exactly 3 words.' }]
      })
    });
    const data = await response.json();
    return {
      keyPresent: hasKey,
      httpStatus: response.status,
      response: data,
      text: data.content ? data.content[0].text : 'no text'
    };
  } catch (e) {
    return { error: e.message };
  }
}

async function runPipeline(env) {
  const log = [];
  try {
    const feeds = [
      { url: 'https://kotaku.com/tag/grand-theft-auto/rss', type: 'B', priority: 'high' },
      { url: 'https://www.pcgamer.com/rss/', type: 'A', priority: 'normal' },
      { url: 'https://www.eurogamer.net/feed', type: 'B', priority: 'normal' }
    ];

    const fresh = [];
    const cutoff = Date.now() - (72 * 60 * 60 * 1000);

    for (const feed of feeds) {
      try {
        const res = await fetch(feed.url, {
          headers: { 'User-Agent': 'Mozilla/5.0 (compatible; 56ViceLaneBot/1.0)' }
        });
        if (!res.ok) {
          log.push('Feed failed: ' + feed.url + ' status ' + res.status);
          continue;
        }
        const xml = await res.text();
        const items = parseRSS(xml);
        log.push('Feed ' + feed.url + ' returned ' + items.length + ' items');

        for (const item of items) {
          if (!item.title || !item.link) continue;
          if (item.pubDate && new Date(item.pubDate).getTime() < cutoff) continue;
          const cacheKey = 'seen:' + item.link.replace(/[^a-zA-Z0-9]/g, '').slice(0, 60);
          const seen = await env.NEWS_CACHE.get(cacheKey);
          if (seen) continue;
          await env.NEWS_CACHE.put(cacheKey, '1', { expirationTtl: 604800 });
          fresh.push({
            title: item.title,
            link: item.link,
            summary: item.description ? item.description.replace(/<[^>]*>/g, '').slice(0, 300) : '',
            type: feed.type,
            priority: feed.priority
          });
        }
      } catch (e) {
        log.push('Feed error: ' + e.message);
      }
    }

    log.push('Total fresh stories: ' + fresh.length);
    if (fresh.length === 0) {
      return { success: true, log: log, drafted: 0, message: 'No new stories' };
    }

    // GATE: keep only on-mission stories (GTA-direct or industry-impact-with-nexus)
    const qualified = [];
    for (const s of fresh) {
      const g = gateStory(s);
      if (g.pass) {
        s.gateType = g.type; s.franchise = g.franchise;
        qualified.push(s);
        log.push('QUALIFY ' + g.type + '/' + g.franchise + ': "' + s.title + '" (' + g.reasons.join(', ') + ')');
      } else {
        log.push('SKIP (' + g.score + '/2): "' + s.title + '"');
      }
    }
    if (qualified.length === 0) {
      await notifyBrew(['No on-mission GTA stories this run'], env);
      return { success: true, log: log, drafted: 0, message: 'No qualifying stories' };
    }
    // Pick best Type B (GTA universe) and best Type A (industry intel) from qualified
    const typeB = qualified.filter(function(s) { return s.gateType === 'B'; });
    const typeA = qualified.filter(function(s) { return s.gateType === 'A'; });
    const picks = [];
    if (typeB.length > 0) picks.push(typeB[0]);
    if (typeA.length > 0) picks.push(typeA[0]);

    const drafted = [];
    for (const story of picks) {
      log.push('Attempting draft: ' + story.title);
      try {
        const draft = await callClaude(story, env);
        if (draft && draft.error) {
          log.push('Claude error: ' + draft.error + ' status: ' + draft.status);
          continue;
        }
        if (draft && draft.headline) {
          const key = 'draft:' + Date.now() + ':' + story.title.slice(0, 30).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
          await env.DRAFT_QUEUE.put(key, JSON.stringify({
            headline: draft.headline,
            slug: draft.slug,
            metaDescription: draft.metaDescription,
            leadParagraph: draft.leadParagraph,
            bottomLine: draft.bottomLine,
            articleHTML: draft.articleHTML,
            tags: draft.tags,
            articleType: draft.articleType || story.gateType,
            franchise: draft.franchise || story.franchise,
            originalStory: story,
            status: 'pending_review',
            createdAt: new Date().toISOString()
          }), { expirationTtl: 604800 });
          await saveToAirtable(draft, story, env);
          drafted.push(draft.headline);
          log.push('Drafted successfully: ' + draft.headline);
        } else {
          log.push('Draft returned null or no headline');
        }
      } catch (e) {
        log.push('Draft exception: ' + e.message);
      }
    }

    if (drafted.length > 0) {
      await notifyBrew(drafted, env);
    }

    return { success: true, log: log, drafted: drafted.length, headlines: drafted };

  } catch (e) {
    return { success: false, error: e.message, log: log };
  }
}

function parseRSS(xml) {
  const items = [];
  let matches = Array.from(xml.matchAll(/<item[\s>]([\s\S]*?)<\/item>/gi));
  if (matches.length === 0) {
    matches = Array.from(xml.matchAll(/<entry[\s>]([\s\S]*?)<\/entry>/gi));
  }
  for (const match of matches) {
    const block = match[1];
    function getField(tags) {
      for (const tag of tags) {
        const cdata = new RegExp('<' + tag + '[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]>', 'i').exec(block);
        if (cdata) return cdata[1].trim();
        const plain = new RegExp('<' + tag + '[^>]*>([\\s\\S]*?)<\\/' + tag + '>', 'i').exec(block);
        if (plain) return plain[1].replace(/<[^>]*>/g, '').trim();
        const href = new RegExp('<' + tag + '[^>]*href=["\']([^"\']+)["\']', 'i').exec(block);
        if (href) return href[1].trim();
      }
      return '';
    }
    const title = getField(['title']).replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    const link = getField(['link', 'guid', 'id']);
    const description = getField(['description', 'summary', 'content']);
    const pubDate = getField(['pubDate', 'published', 'updated']);
    if (title && title.length > 3 && link) {
      items.push({ title: title, link: link, description: description, pubDate: pubDate });
    }
  }
  return items;
}

async function callClaude(story, env) {
  const system = [
    'You write 56ViceLane articles - a GTA5-to-GTA6 fan hub. Tagline: Where GTA5 Ends And GTA6 Begins. Output must match house style exactly so it drops into the template.',
    'VOICE: sharp, confident, plainspoken - a former pro gamer talking to players. Lead with the answer. Always tie the story to what it means for GTA6 players.',
    'LENGTH: aim ~1800-2000 words in articleHTML. Four sections.',
    'SOURCE TAGS - mark every claim inline using these exact spans: confirmed (official Rockstar/Take-Two/SEC) = <span class="cf">checkmark</span> using the check emoji; credible leak/analysis (named source) = <span class="lk">~</span>; correction = <span class="cr">!</span>.',
    'CONFIRMED FACTS (may state as confirmed): launch Nov 19 2026 PS5/Xbox; Jason Duval and Lucia Caminos; state Leonida; Vice City; 6 regions (Vice City, Leonida Keys, Grassrivers, Port Gellhorn, Ambrosia, Mount Kalaga); marketing ramps summer 2026; no review copies.',
    'NEVER state as fact: prone crawling (cut), dual wielding (cut), generative AI in GTA6 (none), a PC release date (none official). Speculation is allowed ONLY if clearly labeled as speculation - never pass a guess off as fact.',
    'IP: 100 percent original. No Rockstar artwork, logos, or copied text. Paraphrase everything.',
    'articleHTML FORMAT: start with <p class="lead">...</p>, then four <h2 class="reveal">Heading</h2> each followed by <p class="source-line">Source: ...</p> and one or more <p class="reveal">...</p>. Put TWO ad slots inside the body, each exactly: <div class="ad-slot reveal"><div class="ad-label">Advertisement</div><ins class="adsbygoogle" style="display:block" data-ad-client="ca-pub-8376427875991063" data-ad-slot="auto" data-ad-format="auto" data-full-width-responsive="true"></ins></div>. End with <h2 class="bottom-line-header reveal">The bottom line</h2><p class="bottom-line reveal">...</p>. No head, nav, or footer. No Airtable token or secret anywhere.',
    'Return ONLY valid JSON, no markdown, no backticks: {"headline":"keyword-front-loaded title","slug":"lowercase-hyphenated","tags":"comma, separated","metaDescription":"under 155 chars","articleType":"A or B","franchise":"GTA or RedDead","leadParagraph":"100-150 words","bottomLine":"150-200 words","articleHTML":"full clean-style body","priority":"normal"}'
  ].join(' ');
  const userMsg = 'Write a 56ViceLane article about: ' + story.title + '\nSource: ' + story.link + '\nSummary: ' + story.summary;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': env.ANTHROPIC_KEY,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 8000,
      system: system,
      messages: [{ role: 'user', content: userMsg }]
    })
  });

  const httpStatus = response.status;
  const data = await response.json();

  if (httpStatus !== 200) {
    return { error: JSON.stringify(data), status: httpStatus };
  }

  if (!data.content || !data.content[0] || !data.content[0].text) {
    return { error: 'No content in response', status: httpStatus };
  }

  const text = data.content[0].text.trim();
  const clean = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
  return JSON.parse(clean);
}

async function saveToAirtable(draft, story, env) {
  try {
    await fetch('https://api.airtable.com/v0/' + env.AIRTABLE_BASE + '/ArticleDrafts', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + env.AIRTABLE_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fields: {
          Headline: draft.headline || '',
          Slug: draft.slug || '',
          Tags: draft.tags || '',
          MetaDescription: draft.metaDescription || '',
          LeadParagraph: draft.leadParagraph || '',
          ArticleHTML: draft.articleHTML || '',
          BottomLine: draft.bottomLine || '',
          ArticleType: draft.articleType || story.gateType || '',
          Franchise: draft.franchise || story.franchise || 'GTA',
          SourceURL: story.link || '',
          Status: (draft.franchise === 'RedDead' || story.franchise === 'RedDead') ? 'Hold-RedDead' : 'Draft',
          CreatedAt: new Date().toISOString()
        }
      })
    });
  } catch (e) {}
}

async function notifyBrew(headlines, env) {
  try {
    await fetch('https://ntfy.sh/' + env.NTFY_TOPIC, {
      method: 'POST',
      headers: { 'Title': '56ViceLane Articles Ready', 'Priority': 'default', 'Tags': 'video_game' },
      body: headlines.length === 1 ? 'Draft ready: ' + headlines[0] : headlines.length + ' drafts ready: ' + headlines.join(', ')
    });
  } catch (e) {}
}
