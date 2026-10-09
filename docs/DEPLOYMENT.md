# Despliegue web

## Vercel

1. Importa el repositorio `stefanodurante/MYPOOLquote`.
2. Selecciona el branch de preproducción.
3. Configura las variables de entorno en Project Settings, nunca en Git.
4. Ejecuta el primer despliegue.

Variables mínimas:

```env
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=secreto-produccion-diferente
BETTER_AUTH_URL=https://preproduction.example.com
BETTER_AUTH_TRUSTED_ORIGINS=https://preproduction.example.com
STAFF_EMAIL=staff@mypoolquote.local
STAFF_PASSWORD=...
STAFF_NAME=MYPOOL Staff
```

Las variables `NEXT_PUBLIC_SUPABASE_URL` y
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` solo son necesarias si se usan los
helpers Supabase del cliente.

## Base de datos

Conecta `DATABASE_URL` a la base Supabase de preproducción y ejecuta una vez:

```bash
npm run db:push
npm run seed:staff
```

Usa una contraseña de staff distinta de la contraseña de la base de datos.

## Checklist

- `npm run build` pasa localmente.
- `BETTER_AUTH_URL` coincide exactamente con el dominio HTTPS.
- El dominio está incluido en `BETTER_AUTH_TRUSTED_ORIGINS`.
- `.env.local` no está versionado.
- El login crea una cookie de sesión HTTPS.
- El staff puede abrir el dashboard y guardar un presupuesto.
- Supabase tiene backups y límites revisados.

## Rollback

Vercel permite volver al deployment anterior. No ejecutes `db:push` destructivo
durante un rollback de aplicación; revisa primero cambios de schema.
