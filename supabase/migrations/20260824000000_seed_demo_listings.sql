insert into public.categories (slug, name, description)
values ('ai', 'AI', 'Artificial intelligence products')
on conflict (slug) do update set name = excluded.name;

insert into public.listings (slug, name, website_url, normalized_domain, short_description, status, total_bid_cents, total_clicks, category_id, last_bid_at)
select v.slug, v.name, v.website_url, v.normalized_domain, v.short_description, 'active'::public.listing_status, v.total_bid_cents, v.total_clicks, c.id, now() - v.bid_age
from (values
  ('nex-ai', 'Nex', 'https://nex.ai/', 'nex.ai', 'A focused AI workspace for teams that want to move from idea to execution faster.', 2500::bigint, 1847::bigint, interval '2 hours'),
  ('archal-ai', 'Archal', 'https://archal.ai/', 'archal.ai', 'An AI product built for clear thinking, faster workflows, and practical momentum.', 2100::bigint, 1324::bigint, interval '5 hours'),
  ('tsenta', 'Tsenta', 'https://tsenta.com/', 'tsenta.com', 'A modern tool for building and shipping smarter customer experiences.', 1700::bigint, 986::bigint, interval '1 day'),
  ('context-dev', 'Context', 'https://www.context.dev/', 'context.dev', 'Developer context that helps technical teams stay aligned and move with confidence.', 1200::bigint, 741::bigint, interval '2 days')
) as v(slug, name, website_url, normalized_domain, short_description, total_bid_cents, total_clicks, bid_age)
cross join public.categories c
where c.slug = 'ai'
on conflict (normalized_domain) do update set
  name = excluded.name,
  short_description = excluded.short_description,
  status = excluded.status,
  total_bid_cents = excluded.total_bid_cents,
  total_clicks = excluded.total_clicks,
  category_id = excluded.category_id,
  last_bid_at = excluded.last_bid_at,
  updated_at = now();
