
/**
 * Create notifications for all group members about the spend
 */
create or replace function public.create_group_spend_notifications()
returns trigger as $$
  declare
    group_member record;
  begin
    for group_member in (
      select gm.user_id
      from public.sb__group_member gm
      where gm.group_id = new.group_id and gm.user_id != auth.uid()
    )
    loop
      insert into public.sb__notification (
        type,
        user_id,
        resource_id
      ) values (
        'group_spend',
        group_member.user_id,
        new.id
      );
    end loop;

    return new;
  end;
$$ language plpgsql security definer set search_path = public;
alter function public.create_group_spend_notifications() owner to postgres;
grant all on function public.create_group_spend_notifications() to authenticated, service_role;

--> statement-breakpoint

create or replace trigger on_group_spend
after insert on public.sb__group_spend for each row
execute function public.create_group_spend_notifications();

--> statement-breakpoint

/**
 * Create notifications for all group members about the new group member add
 */
create or replace function public.create_group_member_add_notifications()
returns trigger as $$
  declare
    group_member record;
  begin
    for group_member in (
      select gm.user_id
      from public.sb__group_member gm
      where gm.group_id = new.group_id and gm.user_id != auth.uid()
    )
    loop
      insert into public.sb__notification (
        type,
        user_id,
        resource_id
      ) values (
        'group_member_add',
        group_member.user_id,
        new.user_id
      );
    end loop;

    return new;
  end;
$$ language plpgsql security definer set search_path = public;
alter function public.create_group_member_add_notifications() owner to postgres;
grant all on function public.create_group_member_add_notifications() to authenticated, service_role;

--> statement-breakpoint

create or replace trigger on_group_member_add
after insert on public.sb__group_member for each row
execute function public.create_group_member_add_notifications();
