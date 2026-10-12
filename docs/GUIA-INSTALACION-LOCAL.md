# Guía sencilla de instalación local

Esta guía está pensada para un instalador de piscinas que necesita ejecutar
MYPOOLquote en su ordenador, sin conocimientos de programación.

## 1. Qué necesitas

Instala primero:

- Node.js 20 o superior: <https://nodejs.org/>
- Git: <https://git-scm.com/downloads>
- Una base de datos Supabase preparada por el responsable del proyecto.

Para comprobar que Node.js y npm están instalados:

```bash
node --version
npm --version
```

Si ambos comandos muestran una versión, puedes continuar.

## 2. Descargar el proyecto

Abre una terminal y ejecuta:

```bash
git clone https://github.com/stefanodurante/MYPOOLquote.git
cd MYPOOLquote
git checkout feat/nextjs-staff-foundation
npm install
```

Si el proyecto ya está descargado, actualízalo así:

```bash
cd MYPOOLquote
git pull
npm install
```

## 3. Crear la configuración local

Crea el archivo de configuración:

```bash
cp .env.example .env.local
```

Ábrelo con un editor de texto:

```bash
nano .env.local
```

Completa las variables con los datos entregados por el responsable:

```env
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=un-secreto-largo
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_TRUSTED_ORIGINS=http://localhost:3000
STAFF_EMAIL=staff@mypoolquote.local
STAFF_PASSWORD=una-contraseña-segura
STAFF_NAME=MYPOOL Staff
NEXT_PUBLIC_SUPABASE_URL=https://project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

En `nano`:

- Guarda con `Ctrl+O`, pulsa `Enter`.
- Sal con `Ctrl+X`.

No publiques `.env.local`, no lo envíes por email y no lo subas a GitHub.
No ejecutes `cat .env.local` ni compartas una captura del archivo: contiene
contraseñas y conexiones privadas.

Para crear un secreto nuevo de autenticación:

```bash
openssl rand -base64 32
```

Copia el resultado en `BETTER_AUTH_SECRET`.

## 4. Preparar la base de datos y el usuario

Comprueba que faltan variables o están mal configuradas sin mostrar secretos:

```bash
npm run check:env
```

Aplica las tablas de la aplicación:

```bash
npm run db:push
```

Crea el usuario staff:

```bash
npm run seed:staff
```

Si aparece `User already exists`, significa que la cuenta ya existe. Para
recrearla con la contraseña actual de `.env.local`:

```bash
npm run reset:staff
npm run seed:staff
```

El usuario para entrar es el valor de `STAFF_EMAIL`. La contraseña es el valor
de `STAFF_PASSWORD`. Escríbelos en la pantalla de login, sin escribir
`STAFF_EMAIL=` ni `STAFF_PASSWORD=`.

## 5. Arrancar la aplicación

Inicia el servidor:

```bash
npm run dev -- --hostname 0.0.0.0
```

En el mismo ordenador abre:

```text
http://localhost:3000/login
```

Para detener la aplicación, vuelve a la terminal y pulsa:

```text
Ctrl+C
```

## 6. Abrir desde un móvil en la misma red

Conecta el móvil y el ordenador a la misma red Wi-Fi. Busca la dirección IP
del ordenador:

```bash
hostname -I
```

Usa la dirección local, no una dirección `172.42.x.x` del contenedor:

```text
http://192.168.1.123:3000/login
```

Sustituye `192.168.1.123` por la dirección que muestra tu ordenador.

La instalación como aplicación en el móvil requiere normalmente una URL
HTTPS. Para pruebas locales puedes abrirla en el navegador, pero la opción
**Instalar aplicación** se debe validar en el deployment HTTPS de Vercel.

## 7. Problemas habituales

### La aplicación no arranca

Detén procesos antiguos y limpia la compilación local:

```bash
pkill -f "next dev" || true
rm -rf .next
npm run dev -- --hostname 0.0.0.0
```

### El login dice «Email o password non validi»

1. Comprueba que el email escrito coincide con `STAFF_EMAIL`.
2. Comprueba que la contraseña coincide con `STAFF_PASSWORD`.
3. Recrea la cuenta:

```bash
npm run reset:staff
npm run seed:staff
```

4. Reinicia Next.js.

### Aparece un error de Server Action antigua

Es una página antigua guardada en el navegador. Cierra las pestañas de la
aplicación, abre una ventana privada y vuelve a entrar en `/login`. Si no
funciona, borra los datos del sitio y registra de nuevo el service worker.

### Error 500

No repitas muchas veces el guardado de un presupuesto. Anota:

- URL;
- hora;
- dispositivo;
- navegador;
- operación que estabas realizando;
- captura de pantalla sin contraseñas.

Entrega estos datos al responsable del proyecto para revisar los logs.

## 8. Pruebas opcionales

Estas pruebas necesitan conexión a la base Supabase:

```bash
npm run test:quote
npm run test:roles
npm run test:integration
npm run test:supabase
```

Una instalación normal solo necesita ejecutar `npm run setup`, salvo que el
responsable indique otro procedimiento.
