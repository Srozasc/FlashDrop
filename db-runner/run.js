const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

const MIG_DIR = path.resolve(__dirname, '..', 'supabase', 'migrations');

function listSql() {
  return fs.readdirSync(MIG_DIR).filter(f => f.endsWith('.sql')).sort().map(f => path.join(MIG_DIR, f));
}

async function applyFile(client, file) {
  const sql = fs.readFileSync(file, 'utf8');
  const name = path.basename(file);
  console.log(`\n=== ${name} ===`);
  await client.query('begin');
  try {
    await client.query(sql);
    await client.query('commit');
    console.log(`OK ${name}`);
  } catch (e) {
    await client.query('rollback');
    console.error(`ERR ${name}: ${e.message}`);
    throw e;
  }
}

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
    const arg = process.argv[2];
    const files = arg ? [path.isAbsolute(arg) ? arg : path.join(MIG_DIR, arg)] : listSql();
    for (const f of files) await applyFile(client, f);
    console.log('\nDone');
  } finally {
    await client.end();
  }
}

main().catch(e => {
  console.error('Fail', e);
  process.exit(1);
});
