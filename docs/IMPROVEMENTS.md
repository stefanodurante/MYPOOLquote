# Mejoras pendientes

## Antes de producción

1. [x] Automatizar tests de cálculo, login, autorización y persistencia (`npm run test:quote` y `npm run test:integration`).
2. [x] Añadir páginas de error y logging estructurado.
3. [x] Revisar rate limiting, CSRF, orígenes confiables y cookies HTTPS.
4. [x] Añadir validación server-side de todos los inputs y límites numéricos.
5. [x] Añadir CI con lint, typecheck, build y migración en una base de prueba (requiere configurar `TEST_DATABASE_URL` en GitHub).
6. [ ] Añadir pruebas específicas de integración con Supabase: conexión, esquema, autenticación y persistencia (implementadas; pendientes de validar porque la publishable key local devuelve HTTP 401).

## Próximo ciclo

1. [x] Edición y detalle de presupuestos guardados (`/quotes/[id]` y `/quotes/new?edit=...`).
2. [x] Búsqueda, filtros, paginación y estados del presupuesto en el dashboard.
3. [x] Panel staff de administración de catálogo y precios (`/admin/catalog`).
4. [x] Historial/auditoría de creación y actualización de presupuestos.
5. [x] Exportación de PDF con logo, numeración y datos fiscales del presupuesto.

## Futuro

1. Rol `customer` con acceso de solo lectura.
2. Vinculación cliente-usuario y enlaces seguros de presupuesto.
3. Multiempresa/multitenant para instaladores.
4. Notificaciones por email y seguimiento de aceptación.
5. Monitoring, backups verificados y preview deployments.
6. Localización de la aplicación en italiano (`it`), español (`es`) e inglés (`en`), con italiano como idioma inicial.

## Incidencias resueltas

- Desactivado Turbopack en desarrollo para evitar errores de chunks SSR y del React Client Manifest.
- Documentado el reinicio limpio de Next.js eliminando `.next` cuando quedan artefactos obsoletos.
- Verificado el build de producción, el typecheck y el test de cálculo de presupuestos.
