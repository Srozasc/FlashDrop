# Migraciones de Base de Datos (Supabase)

## Cómo ejecutarlas

1. Abre tu proyecto en Supabase.
2. Ve a SQL Editor.
3. Copia y ejecuta, en orden:
   - `0001_init.sql`
   - `0002_policies.sql`
   - `0003_seed.sql`

## Notas

- Las políticas permiten lectura pública para facilitar el desarrollo.
- En producción, restringe las políticas según el `user_id` y los roles.

