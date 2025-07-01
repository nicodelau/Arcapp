# Sistema de Autenticación ARCA App

## Configuración

### 1. Variables de Entorno

Crea un archivo `.env.local` basado en `.env.example`:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus configuraciones:

```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/arcapp_db"
JWT_SECRET="tu-clave-secreta-muy-segura-aqui"
```

### 2. Base de Datos

Ejecuta las migraciones de Prisma:

```bash
npx prisma migrate dev
```

### 3. Usuario Administrador

Crea un usuario administrador:

```bash
npm run create-admin
```

Esto creará un usuario con las siguientes credenciales:
- **Username:** admin
- **Email:** admin@example.com
- **Password:** admin123

**⚠️ Importante:** Cambia la contraseña después del primer login en producción.

## Funcionalidades

### Sistema de Autenticación JWT

- **Login:** `/login`
- **Registro:** `/register`
- **Verificación de sesión:** Automática mediante JWT
- **Logout:** Disponible en la navbar

### Estructura de Usuario

La tabla de usuarios contiene:
- `id`: ID único del usuario
- `username`: Nombre de usuario único
- `user_email`: Email único
- `user_password`: Contraseña hasheada con bcrypt
- `user_uuid`: UUID único para el usuario

### Protección de Rutas

Las rutas están protegidas mediante el componente `ProtectedRoute`. Las páginas que requieren autenticación redirigen automáticamente a `/login`.

### APIs Disponibles

#### POST `/api/auth/login`
Autentica un usuario y devuelve un JWT.

**Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "message": "Login exitoso",
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "uuid": "user-uuid-here"
  }
}
```

#### POST `/api/auth/register`
Registra un nuevo usuario.

**Body:**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "password123"
}
```

#### GET `/api/auth/verify`
Verifica si un JWT es válido.

**Headers:**
```
Authorization: Bearer jwt-token-here
```

## Uso

1. Ejecuta la aplicación: `npm run dev`
2. Ve a `http://localhost:3000/login`
3. Usa las credenciales del administrador o regístrate
4. Una vez autenticado, tendrás acceso a todas las funcionalidades

## Seguridad

- Las contraseñas se hashean con bcrypt (12 rounds)
- Los JWTs tienen una duración de 24 horas
- Cada usuario tiene un UUID único para identificación adicional
- Las rutas están protegidas automáticamente
