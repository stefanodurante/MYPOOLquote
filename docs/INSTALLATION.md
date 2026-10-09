# Instalación

## Requisitos

- Node.js 20 o superior
- npm
- Proyecto Supabase con PostgreSQL

## Configuración local

```bash
npm install
cp .env.example .env.local
```

Completa estas variables:

```env
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=un-secreto-largo-y-aleatorio
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_TRUSTED_ORIGINS=http://localhost:3000
STAFF_EMAIL=staff@mypoolquote.local
STAFF_PASSWORD=una-clave-de-desarrollo
STAFF_NAME=MYPOOL Staff
```

No uses la contraseña de PostgreSQL como contraseña de staff.

## Base de datos y usuario inicial

```bash
npm run check:env
npm run db:push
npm run seed:staff
```

El comando `seed:staff` crea el usuario indicado por `STAFF_EMAIL`. Si hay que recrearlo:

```bash
npm run reset:staff
npm run seed:staff
```

## Desarrollo

```bash
npm run dev -- --hostname 0.0.0.0
```

Abre `/login`. Si el navegador muestra chunks 404 después de reiniciar Turbopack, detén el servidor, elimina `.next`, y vuelve a arrancar.
