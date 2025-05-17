create trigger "send_notifications" after insert
on public.notification for each row
execute function supabase_functions.http_request(
  'http://localhost:3000',
  'POST',
  '{"Content-Type":"application/json"}',
  '{}',
  '1000'
);
