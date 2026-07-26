# GeStore

GeStore es una aplicación web full stack desarrollada con Node.js + Express en el backend y React + Vite en el frontend. Incluye autenticación con JWT, protección de rutas, gestión de usuarios y un panel administrativo.

## Características

- Inicio de sesión con autenticación JWT
- Protección de rutas en frontend y backend
- Panel de administración
- Gestión de usuarios (crear, editar, eliminar)
- Registro de nuevos usuarios con rol cliente por defecto
- Diseño con Bootstrap

## Estructura del proyecto

```text
GeStore/
├── backend/
│   ├── app.js
│   ├── bin/
│   ├── db/
│   ├── public/
│   ├── routes/
│   └── views/
├── frontend/
│   ├── public/
│   ├── src/
│   ├── index.html
│   └── package.json
└── README.md
```

## Requisitos previos

- Node.js 18 o superior
- npm
- MySQL local o remoto

## Instalación

1. Clona el repositorio.
2. Instala las dependencias del backend:

```bash
cd backend
npm install
```

3. Instala las dependencias del frontend:

```bash
cd ../frontend
npm install
```

## Configuración de la base de datos

El backend está configurado para conectarse a MySQL en la base de datos `gestore2.0`.
Ajusta los datos de conexión en:

- `backend/db/connection.js`

Asegúrate de tener una tabla `user` con al menos estas columnas:

- `id`
- `username`
- `role` 
- `password`


## Ejecución

### Backend

```bash
cd backend
npm start
```

### Frontend

```bash
cd frontend
npm run dev
```

La aplicación quedará disponible en:

- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## Uso

- Ingresa al frontend y accede a la pantalla de login.
- Puedes iniciar sesión con un usuario registrado o usar el usuario de respaldo para pruebas:
  - Usuario: `admin`
  - Contraseña: `admin123`

## Scripts útiles

### Backend

- `npm start`: inicia el servidor con watch
- `npm run dev`: inicia el servidor en modo desarrollo

### Frontend

- `npm run dev`: inicia Vite
- `npm run build`: genera la versión de producción
- `npm run preview`: previsualiza la build

## Notas

Este proyecto fue desarrollado como una demostración de un sistema con autenticación, control de acceso y gestión de usuarios.
