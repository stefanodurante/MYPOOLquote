# Mejoras pendientes

## Antes de producción

1. [x] Automatizar tests de cálculo, login, autorización y persistencia (`npm run test:quote` y `npm run test:integration`).
2. [x] Añadir páginas de error y logging estructurado.
3. [x] Revisar rate limiting, CSRF, orígenes confiables y cookies HTTPS.
4. [x] Añadir validación server-side de todos los inputs y límites numéricos.
5. [x] Añadir CI con lint, typecheck, build y migración en una base de prueba (requiere configurar `TEST_DATABASE_URL` en GitHub).
6. [x] Añadir pruebas específicas de integración con Supabase: conexión, esquema, autenticación y persistencia (`npm run test:supabase`).

## Próximo ciclo

1. [x] Edición y detalle de presupuestos guardados (`/quotes/[id]` y `/quotes/new?edit=...`).
2. [x] Búsqueda, filtros, paginación y estados del presupuesto en el dashboard.
3. [x] Panel staff de administración de catálogo y precios (`/admin/catalog`).
4. [x] Historial/auditoría de creación y actualización de presupuestos.
5. [x] Exportación de PDF con logo, numeración y datos fiscales del presupuesto.
6. [x] Seed idempotente y administración staff de modelos de piscinas (`npm run seed:catalog` y `/admin/catalog/models`).
7. [x] Separación de teléfono y email del cliente final en el presupuesto.
8. [x] Hub staff de administración (`/admin`) para catálogo y futuras gestiones.

## Backlog futuro priorizado

Las tareas están ordenadas por dependencia e importancia comercial. El rol `professional`
debe implementarse antes que `customer`, porque será el usuario principal de pago de la
aplicación.

### P0 — Fundación multiusuario

1. [x] Definir los roles `staff`, `professional` y `customer`, con permisos separados
   (base de roles y helpers implementada; faltan sus flujos de producto).
2. [x] Dividir el formulario de presupuesto en pasos, priorizando la experiencia móvil.
3. [x] Hacer fiable el guardado del presupuesto, con feedback, navegación al detalle y
   prevención de pérdida accidental de datos.
4. Añadir aislamiento de datos por profesional/organización (`organizationId` o equivalente)
   en usuarios, clientes, presupuestos, catálogo y eventos.
5. Aplicar autorización server-side para impedir que un profesional vea o modifique datos
   de otro profesional.
6. Añadir tests de autorización y aislamiento entre dos profesionales.


### P1 — Producto para profesionales

5. Crear onboarding y perfil profesional: empresa, datos fiscales, logo y configuración de
   presupuestos.
6. Permitir que cada profesional gestione sus clientes y sus presupuestos.
7. Permitir catálogo, precios y plantillas propias por profesional.
8. Adaptar el PDF para utilizar los datos fiscales y la marca del profesional.
9. Añadir dashboard profesional con estados, búsqueda, filtros e historial.

### P2 — Acceso del cliente final

10. Vincular clientes finales con un profesional.
11. Crear enlaces seguros para que el cliente consulte únicamente sus presupuestos.
12. Añadir seguimiento de envío, visualización, aceptación o rechazo del presupuesto.
13. Añadir notificaciones por email para el flujo de aceptación.

### P3 — Comercialización y operación

14. Añadir localización en italiano (`it`), español (`es`) e inglés (`en`), con italiano
    como idioma inicial.
15. Añadir planes, límites de uso y suscripciones para profesionales.
16. Añadir monitoring, backups verificados y preview deployments.

## Incidencias resueltas

- Desactivado Turbopack en desarrollo para evitar errores de chunks SSR y del React Client Manifest.
- Documentado el reinicio limpio de Next.js eliminando `.next` cuando quedan artefactos obsoletos.
- Verificado el build de producción, el typecheck y el test de cálculo de presupuestos.
