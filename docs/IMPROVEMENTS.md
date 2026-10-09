# Mejoras pendientes

## Antes de producción

1. Automatizar tests de cálculo, login, autorización y persistencia.
2. Añadir páginas de error y logging estructurado.
3. Revisar rate limiting, CSRF, orígenes confiables y cookies HTTPS.
4. Añadir validación server-side de todos los inputs y límites numéricos.
5. Añadir CI con lint, typecheck, build y migración en una base de prueba.

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
