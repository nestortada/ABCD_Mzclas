ABCD Mezclas — Flujo de Recuperación de Contraseña (Full‑Stack)

Aplicación de demostración con frontend (Vite + React + React Router) y backend (Node.js + Express + Mongoose) que implementa un flujo seguro de recuperación / restablecimiento de contraseña con tokens de un solo uso, expiración estricta y envío de correos.

Características
- Backend: Express, Mongoose, JWT, bcrypt, zod, Helmet, CORS, rate limiting.
- Frontend: Vite + React, React Router, formularios accesibles.
- Endpoints: POST /api/auth/{register,login,request-reset,reset}.
- Token de restablecimiento: aleatorio (32 bytes), solo se guarda el hash (SHA‑256), expira a los 15 minutos y es de un solo uso.
- Correo con enlace temporal: https://<FRONTEND_HOST>/reset?token=<raw>&email=<encodedEmail>.
- Seguridad: respuestas genéricas (no filtra si un email existe), Helmet, CORS, rate limit por IP+email.
- Datos demo: script seed para crear usuario de prueba.
- Tests (Vitest + Supertest): 2 pruebas de integración básicas del flujo.

Estructura
- server/: Backend (JavaScript)
- frontend/: Frontend (Vite + React)

Requisitos
- Node.js 18+
- Cuenta/cluster de MongoDB Atlas (o Mongo local)

Configuración
1) Backend
- Copia server/.env.example a server/.env y completa valores:

PORT=4000
MONGO_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=<tu_secret>
JWT_RESET_SECRET=<tu_reset_secret>
CORS_ORIGIN=http://localhost:5173
FRONTEND_ORIGIN=http://localhost:5173

# Proveedor de correo
MAIL_PROVIDER=emailjs
MAIL_FROM="ABCD Mezclas" <no-reply@abcdmezclas.local>

# EmailJS
EMAILJS_SERVICE_ID=
EMAILJS_TEMPLATE_ID=
EMAILJS_PUBLIC_KEY=
EMAILJS_PRIVATE_KEY=

2) Frontend
- Copia frontend/.env.example a frontend/.env y ajusta:

VITE_API_BASE_URL=http://localhost:4000

Instalación
En cada carpeta (server/ y frontend/):

cd server
npm install

cd ../frontend
npm install

Scripts
- Backend (server/):
  - npm run dev — inicia API con recarga (node --watch)
  - npm run build — no aplica (JS)
  - npm start — node src/index.js
  - npm run seed — crea usuario demo demo@example.com / Demo123!

- Frontend (frontend/):
  - npm run dev — levanta Vite en http://localhost:5173
  - npm run build — build de producción
  - npm start — vista previa del build

Arranque
1) Inicia backend:

cd server
npm run dev

2) Inicia frontend en otra terminal:

cd frontend
npm run dev

3) (Opcional) Seed de usuario demo:

cd server
npm run seed

Endpoints del flujo
- POST /api/auth/register — body: { email, password }. Crea usuario (respuesta genérica si ya existe).
- POST /api/auth/login — body: { email, password }. Devuelve { accessToken } (JWT 1h).
- POST /api/auth/request-reset — body: { email }. Genera token (hash + exp 15m), envía email. Respuesta siempre { ok: true }.
- POST /api/auth/reset — body: { email, token, newPassword }. Verifica token/exp, invalida token, actualiza contraseña.

Envío de correos
- EmailJS (único proveedor en este repo)
  - Deja MAIL_PROVIDER=emailjs y completa EMAILJS_* en server/.env.
  - El backend llama a la API de EmailJS (ver server/src/mail/emailjsProvider.js).
  - En desarrollo, puedes usar MAIL_PROVIDER=log para registrar enlaces en consola sin enviar correos reales.

Frontend (flujo)
- Inicio de sesión en /login con enlace “Olvidé mi contraseña”.
- Página /forgot para introducir email y solicitar enlace.
- Página /reset que recibe token y email por querystring para definir nueva contraseña.

Tests
En server/:

cd server
npm test

Se usan Vitest + Supertest + mongodb-memory-server para aislar pruebas.

Notas de seguridad
- Nunca se guarda el token en claro; solo el hash (SHA‑256).
- Expiración estricta (15 minutos).
- Tokens de un solo uso (se invalidan al usarse o expirar).
- Validación con zod y cabeceras con helmet + CORS configurado.
- Respuestas genéricas para no revelar si un email existe.

Variables de ejemplo del usuario (no se comitean)
Puedes usar las variables que compartiste en tu entorno local .env (no se incluyen en el repo):

MONGO_URI=mongodb+srv://nestortada:Sabana-2022@aplication-web.oh4mvjm.mongodb.net/?retryWrites=true&w=majority&appName=Aplication-web
JWT_SECRET=4f7b9a2c1e5d8f3a9b0c6e2d4a1f8c7b9d0e3f2a1b4c6d7e8f9a0b1c2d3e4f5
JWT_RESET_SECRET=7d4f3a2b1c5e6f7890abcd1234567890abcdef1234567890abcdef1234567890
VITE_EMAILJS_TEMPLATE_ID=template_shJIdbf
VITE_EMAILJS_PUBLIC_KEY=qTpiWlPFdMlFgyk2e

Asegúrate de mantener estos secretos fuera del control de versiones.

