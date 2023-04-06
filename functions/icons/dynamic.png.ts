interface Switch {
  id: string;
  timestamp: string;
  members: { id: string; name: string }[];
}

const fetchRelative = async (
  r: string,
  ctx: EventContext<unknown, any, Record<string, unknown>>
) => {
  const absUrl = new URL(r, new URL(ctx.request.url).origin);
  return fetch(absUrl);
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
    ).then((res) => res.json<Switch>());

    if (!fronters.length) {
      return fetchRelative('/icons/dynamic/default.png', ctx);
    }

    return fetchRelative(`/icons/dynamic/${fronters[0].id}.png`, ctx);
  } catch (e) {
    console.error(e);
    return fetchRelative('/icons/dynamic/default.png', ctx);
  }
};
