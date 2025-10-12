import { api } from '~/lib/trpc'
import { db, eq, schema } from '../../../../../../../packages/db/src'
import { RajMap } from './client'

export default async function MapPage() {
  const cw = await api.priyasthan.workplace.recent0()
  return <pre>{JSON.stringify(cw, null, 2)}</pre>

  const a = await db
    .select({
      id: schema.address.id,
      profileId: schema.profileAddress.profileId,
      latitude: schema.address.latitude,
      longitude: schema.address.longitude,
      type: schema.profileAddress.type,
    })
    .from(schema.profileAddress)
    .innerJoin(schema.address, eq(schema.address.id, schema.profileAddress.addressId))
  const aa = await api.priyasthan.workplace.recent2()
  // console.log({ a, l: a.length })
  // const b = Object.groupBy(a, i => i.profileId)

  return <RajMap locations={aa} />
}

/*
with cte as (
  select customer_id, avg(amount) as avg_amt
  from orders
  group by customer_id
)
select c.name, cte.avg_amt, o.id
from customers c
join orders o on o.customer_id = c.id
join cte on cte.customer_id = o.customer_id
where o.amount > cte.avg_amt;


select c.name, lat.avg_amt, o.id
from customers c
join orders o on o.customer_id = c.id
join lateral (
  select avg(amount) as avg_amt
  from orders o2
  where o2.customer_id = c.id
) as lat on true
where o.amount > lat.avg_amt
*/
