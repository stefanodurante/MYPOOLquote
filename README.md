# MYPOOLquote

Aplicación web para crear, guardar y exportar presupuestos profesionales de piscinas.

## Estado actual

- Next.js 15 + TypeScript
- Better Auth con usuarios `staff`
- Supabase PostgreSQL + Drizzle ORM
- Catálogo y precios persistidos en base de datos
- Calculadora PRO/LITE y exportación PDF
- PWA preparada para móvil

## Inicio rápido

Requisitos: Node.js 20+, npm y una base PostgreSQL/Supabase.

```bash
npm install
cp .env.example .env.local
# completar .env.local
npm run setup
npm run dev
```

Abre `http://localhost:3000/login`.

## Comandos

| Comando | Uso |
| --- | --- |
| `npm run dev` | Desarrollo |
| `npm run lint` | ESLint |
| `npm run build` | Build de producción |
| `npm run check:env` | Validar variables sin imprimir secretos |
| `npm run setup` | Validar entorno, schema y usuario staff |
| `npm run db:push` | Aplicar schema Drizzle |
| `npm run seed:staff` | Crear usuario staff |
| `npm run reset:staff` | Eliminar usuario staff para recrearlo |

## Documentación

- [Instalación](docs/INSTALLATION.md)
- [Arquitectura](docs/ARCHITECTURE.md)
- [Despliegue web](docs/DEPLOYMENT.md)
- [Guía de prueba en italiano](docs/TEST-IT.md)
- [Operaciones](docs/OPERATIONS.md)
- [Mejoras pendientes](docs/IMPROVEMENTS.md)

## Seguridad

`.env.local` está ignorado y nunca debe subirse al repositorio. En producción usa los secretos del proveedor de hosting. No reutilices la contraseña de PostgreSQL como contraseña de staff.
