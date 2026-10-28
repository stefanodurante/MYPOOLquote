# Mejoras pendientes

## Versionado Demo

La versión visible actual es `Demo V1.0.2`. Cada nueva feature debe incrementar
la versión patch: `1.0.2` → `1.0.3`. Actualiza `lib/app-version.ts` para que el
badge, los metadatos y la PWA mantengan una versión coherente.

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
   y flujos básicos de gestión, creación y lectura.
2. [x] Dividir el formulario de presupuesto en pasos, priorizando la experiencia móvil.
3. [x] Hacer fiable el guardado del presupuesto, con feedback, navegación al detalle y
   prevención de pérdida accidental de datos.
4. [x] Añadir pantalla de carga entre login y aplicación.
5. [x] Añadir aislamiento de datos por profesional/organización (`organizationId`) en
   usuarios, clientes, presupuestos, catálogo y eventos. Se creó `organizations`, se
   conservaron los datos actuales en `org-default` y se añadió `npm run seed:organization`.
6. [x] Aplicar autorización server-side para impedir que un profesional vea o modifique
   datos de otra organización. Staff mantiene acceso global; customer solo puede leer
   presupuestos vinculados a sus clientes.
7. [x] Añadir tests de autorización y aislamiento entre dos profesionales
   (`npm run test:multiuser`).


### P1 — Producto para profesionales

5. [x] Crear onboarding y perfil profesional: empresa, datos fiscales, logo y configuración de
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
17. [x] Añadir guía italiana de instalación y prueba de la PWA (`/install` y
   `docs/TEST-IT.md`).
18. [x] Detectar nuevas versiones de la PWA y permitir la actualización confirmada
   por el usuario sin interrumpir el wizard con cambios sin guardar.
19. Añadir render visual de piscina bajo demanda en la página final de revisión,
   con placeholder, loader, imagen de catálogo y aviso si los parámetros cambian.
   La integración con un proveedor de IA real queda como tarea posterior.

### P1.5 — Onboarding profesional implementado

El profesional asociado a una organización puede completar y modificar su perfil en
`/professional/onboarding` y `/professional/profile`. Los datos obligatorios se
validan en servidor y se incorporan al PDF: razón social, NIF/Partita IVA,
dirección, contacto, prefijo, pie de página y URL del logo. La migración segura se
aplica con `npm run db:push`.

## Incidencias resueltas

- Desactivado Turbopack en desarrollo para evitar errores de chunks SSR y del React Client Manifest.
- Documentado el reinicio limpio de Next.js eliminando `.next` cuando quedan artefactos obsoletos.
- Verificado el build de producción, el typecheck y el test de cálculo de presupuestos.
- La base multiusuario requiere ejecutar `npm run db:push` y después
  `npm run seed:organization` en cada entorno existente.
