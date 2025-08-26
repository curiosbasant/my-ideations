import { eq, sql } from 'drizzle-orm'

import { db } from '../client'
import * as schema from '../schema'

const groupSpendNotificationFn = sql.raw('public.sb__create_group_spend_notifications')
const groupMemberJoinNotificationFn = sql.raw('public.sb__create_group_member_join_notifications')

const getGroupMembersSql = sql.raw(
  db
    .select({ userId: schema.sb__member.userId })
    .from(schema.sb__member)
    .where(eq(schema.sb__member.groupId, sql`new.group_id`))
    .toSQL().sql,
)

const insertGroupSpendAddSql = sql.raw(
  db
    .insert(schema.sb__notification)
    .values({
      type: sql.raw("'group_spend_add'"),
      resourceId: sql`new.id`,
      createdBy: sql`new.created_by`,
      userId: sql`group_member.user_id`,
    })
    .toSQL().sql,
)

const insertGroupMemberJoinSql = sql.raw(
  db
    .insert(schema.sb__notification)
    .values({
      type: sql.raw("'group_member_join'"),
      resourceId: sql`new.user_id`,
      createdBy: sql`new.user_id`,
      userId: sql`group_member.user_id`,
    })
    .toSQL().sql,
)

const fn = sql`
  /**
   * Create notifications for all group members about the spend
   */
  create or replace function ${groupSpendNotificationFn}()
  returns trigger as $$
    declare
      group_member record;
    begin
      for group_member in (${getGroupMembersSql})
      loop
        ${insertGroupSpendAddSql};
      end loop;
      return new;
    end;
  $$ language plpgsql security definer set search_path = public;
  alter function ${groupSpendNotificationFn}() owner to postgres;
  grant all on function ${groupSpendNotificationFn}() to authenticated, service_role;

  create or replace trigger sb__on_group_spend
  after insert on ${schema.sb__spend} for each row
  execute function ${groupSpendNotificationFn}();

  --> statement-breakpoint

  /**
   * Create notifications for all group members about the new group member add
   */
  create or replace function ${groupMemberJoinNotificationFn}()
  returns trigger as $$
    declare
      group_member record;
    begin
      for group_member in (${getGroupMembersSql})
      loop
        ${insertGroupMemberJoinSql};
      end loop;
      return new;
    end;
  $$ language plpgsql security definer set search_path = public;
  alter function ${groupMemberJoinNotificationFn}() owner to postgres;
  grant all on function ${groupMemberJoinNotificationFn}() to authenticated, service_role;

  create or replace trigger sb__on_group_member_join
  after insert on ${schema.sb__member} for each row
  execute function ${groupMemberJoinNotificationFn}();
`

export default () => db.execute(fn)
