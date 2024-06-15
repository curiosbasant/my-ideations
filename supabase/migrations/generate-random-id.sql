create or replace function public.generate_random_id(size integer)
returns text as $$
  declare
    characters constant text = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789abcdefghijklmnopqrstuvwxyz0123456789';
    result text = '';
  begin
    while length(result) < size loop
      result = result || substr(characters, floor(random() * length(characters) + 1)::integer, 1);
    end loop;
    return result;
  end;
$$ language plpgsql security definer set search_path = public;
--> statement-breakpoint
alter function public.generate_random_id(size integer) owner to postgres;
--> statement-breakpoint
grant all on function public.generate_random_id(size integer) to anon, authenticated, service_role;

