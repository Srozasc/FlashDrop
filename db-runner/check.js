const { Client } = require('pg');

async function main() {
  let url = process.env.SUPABASE_DB_URL || '';
  if (!url) {
    console.error('SUPABASE_DB_URL requerido');
    process.exit(1);
  }
  if (!url.includes('sslmode=')) {
    url += (url.includes('?') ? '&' : '?') + 'sslmode=require';
  }
  const client = new Client({ connectionString: url, ssl: { rejectUnauthorized: false } });
  await client.connect();
  try {
    const o = await client.query('select id,status,courier_name,address,total,created_at from public.orders order by id desc');
    const i = await client.query('select order_id,name,quantity from public.order_items order by order_id,id');
    const tables = await client.query(`select table_name from information_schema.tables where table_schema='public' order by table_name`);
    console.log('orders', o.rows);
    console.log('order_items', i.rows);
    console.log('tables', tables.rows.map(r => r.table_name));
  } finally {
    await client.end();
  }
}

main().catch(e => {
  console.error('Fail', e);
  process.exit(1);
});
