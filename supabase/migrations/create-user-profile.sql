
/**
 * Create a profile for every user registered
 */
create or replace function public.create_user_profile()
returns trigger as $$
  begin
    insert into public.profile (
      id,
      username,
      first_name,
      last_name,
      avatar_url,
      email
    ) values (
      new.id,
      new.raw_user_meta_data ->> 'username',
      split_part(new.raw_user_meta_data ->> 'full_name', ' ', 1),
      split_part(new.raw_user_meta_data ->> 'full_name', ' ', 2),
      new.raw_user_meta_data ->> 'avatar_url',
      new.email
    );

    return new;
  end;
$$ language plpgsql security definer set search_path = public;
alter function public.create_user_profile() owner to postgres;
grant all on function public.create_user_profile() to anon, authenticated, service_role;

--> statement-breakpoint

create or replace trigger on_auth_user_created
after insert on auth.users for each row
execute function public.create_user_profile();
