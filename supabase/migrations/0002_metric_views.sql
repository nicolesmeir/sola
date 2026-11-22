-- Pilot metric helpers (CLAUDE.md "Pilot metrics"). Query from the SQL editor as an admin.
-- Not exposed to users: views run with invoker rights and events has no select policy.

create view public.metric_onboarding as
select
  user_id,
  count(*) filter (where name = 'item_uploaded')                       as items_uploaded,
  min(created_at) filter (where name = 'item_uploaded')                as first_upload_at,
  (array_agg(created_at order by created_at)
     filter (where name = 'item_uploaded'))[10]                         as tenth_upload_at
from public.events
group by user_id;

create view public.metric_outfit_generation as
select
  user_id,
  count(*) filter (where name = 'outfit_request_success') as successes,
  count(*) filter (where name = 'outfit_request_failure') as failures
from public.events
group by user_id;

create view public.metric_weekly_selection_days as
select
  user_id,
  date_trunc('week', created_at) as week,
  count(distinct created_at::date) as days_with_selection,
  avg((props ->> 'seconds_since_request')::numeric) as avg_seconds_request_to_selection
from public.events
where name = 'outfit_selected'
group by user_id, date_trunc('week', created_at);
