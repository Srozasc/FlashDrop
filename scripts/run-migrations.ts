import { readFileSync, readdirSync } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config();

const MIGRATIONS_DIR = path.resolve('supabase', 'migrations');

function getSqlFiles(): string[] {
  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort(); // alphabetical -> 0001, 0002, 0003...
  return files.map((f) => path.join(MIGRATIONS_DIR, f));
}

async function runFile(client: Client, filePath: string) {
  const sql = readFileSync(filePath, 'utf8');
  const name = path.basename(filePath);
  console.log(`\n=== Ejecutando ${name} ===`);
  await client.query('begin');
  try {
    await client.query(sql);
    await client.query('commit');
    console.log(`OK: ${name}`);
  } catch (err) {
    await client.query('rollback');
    console.error(`ERROR en ${name}:`, (err as Error).message);
    throw err;
  }
}

async function main() {
  const dbUrl = process.env.SUPABASE_DB_URL;
  if (!dbUrl) {
    console.error('Falta SUPABASE_DB_URL en variables de entorno. Define la cadena de conexión de Postgres (service role).');
    process.exit(1);
  }
  const client = new Client({ connectionString: dbUrl });
  await client.connect();
  try {
    const files = getSqlFiles();
    if (files.length === 0) {
      console.log('No hay archivos .sql en supabase/migrations');
      return;
    }
    for (const file of files) {
      await runFile(client, file);
    }
    console.log('\nMigraciones completadas correctamente.');
  } finally {
    await client.end();
  }
}

main().catch((e) => {
  console.error('Fallo migraciones:', e);
  process.exit(1);
});

