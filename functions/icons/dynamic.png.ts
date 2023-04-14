interface Switch {
  id: string;
  timestamp: string;
  members: { id: string; name: string }[];
}

const fetchAsset = async (
  r: string,
  ctx: EventContext<unknown, any, Record<string, unknown>>
) => {
  const absUrl = new URL(r, new URL(ctx.request.url).origin);
  const res = await ctx.env.ASSETS.fetch(absUrl);

  if (!res.ok)
    throw new Error(
      `Error fetching ${res.url}: ${res.status} ${res.statusText}`
    );

  return res.clone();
};

export const onRequest: PagesFunction = async (ctx) => {
  if (ctx.request.method !== 'GET') {
    return new Response(null, { status: 405, headers: { Allow: 'GET' } });
  }

  try {
    const { members: fronters } = await fetch(
      'https://api.pluralkit.me/v2/systems/fxyvj/fronters',
      {
        headers: { 'User-Agent': 'ryanccn.dev/unversioned' },
        cf: { cacheTtl: 30, cacheEverything: true },
      }
    ).then((res) => {
      if (!res.ok) throw new Error('Failed to fetch data from PluralKit API');
      return res.json<Switch>();
    });

    if (!fronters.length) {
      return await fetchAsset('/icons/dynamic.png', ctx);
    }

    return await fetchAsset(`/icons/dynamic/${fronters[0].id}.png`, ctx);
  } catch (e) {
    console.error(e);
    return await fetchAsset('/icons/dynamic.png', ctx);
  }
};
