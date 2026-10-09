# Operaciones

## Cuenta staff

Variables locales:

```env
STAFF_EMAIL=staff@mypoolquote.local
STAFF_PASSWORD=...
```

Para recrear una cuenta en un entorno controlado:

```bash
npm run reset:staff
npm run seed:staff
```

No ejecutes el reset contra producción sin confirmar primero la cuenta y la
base de datos seleccionadas.

## Diagnóstico rápido

- `DATABASE_URL` ausente: ejecuta `npm run check:env`.
- Login redirige sin sesión: revisa `BETTER_AUTH_URL`,
  `BETTER_AUTH_TRUSTED_ORIGINS` y HTTPS.
- Chunks Turbopack 404: detén Next.js, elimina `.next` y reinicia.
- Error de schema: revisa `npm run db:push` y los logs de Supabase.
- Build: ejecuta `npm run build` antes de desplegar.

## Datos

Configura backups de Supabase y prueba restauraciones periódicamente. Revisa
los cambios de schema antes de aplicarlos a producción.
