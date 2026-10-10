# Despliegue web

## Vercel

1. Importa el repositorio `stefanodurante/MYPOOLquote`.
2. Selecciona el branch `feat/nextjs-staff-foundation` para pruebas o `main` para producción.
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
NEXT_PUBLIC_SUPABASE_URL=https://project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

`BETTER_AUTH_SECRET` debe ser un secreto nuevo y largo para producción. No
reutilices el secreto local. `BETTER_AUTH_URL` y
`BETTER_AUTH_TRUSTED_ORIGINS` deben coincidir exactamente con el dominio HTTPS
publicado.

Las variables `NEXT_PUBLIC_SUPABASE_*` no son secretos privados, pero deben
pertenecer al mismo proyecto Supabase indicado por `DATABASE_URL`.

## Base de datos

Conecta `DATABASE_URL` a la base Supabase seleccionada y ejecuta una vez desde
un entorno seguro, nunca como parte del build de Vercel:

```bash
npm run db:push
npm run seed:staff
```

Usa una contraseña de staff distinta de la contraseña de la base de datos.
Entrega las credenciales de staff por un canal privado. No las publiques en
GitHub, Vercel logs ni en la guía del tester.

## Checklist

- `npm run build` pasa localmente.
- `BETTER_AUTH_URL` coincide exactamente con el dominio HTTPS.
- El dominio está incluido en `BETTER_AUTH_TRUSTED_ORIGINS`.
- `.env.local` no está versionado.
- El login crea una cookie de sesión HTTPS.
- El staff puede abrir el dashboard y guardar un presupuesto.
- `/manifest.json`, `/icon-192.png` y `/icon-512.png` responden con HTTP 200.
- En Android aparece la opción de instalar MYPOOL desde el navegador.
- Supabase tiene backups y límites revisados.

## Rollback

Vercel permite volver al deployment anterior. No ejecutes `db:push` destructivo
durante un rollback de aplicación; revisa primero cambios de schema.
