const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    const username = 'admin';
    const email = 'admin@example.com';
    const password = 'admin123'; // Cambiar en producción

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { username: username },
          { user_email: email }
        ]
      }
    });

    if (existingUser) {
      console.log('El usuario administrador ya existe');
      return;
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12);

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        username,
        user_email: email,
        user_password: hashedPassword,
        user_uuid: uuidv4()
      }
    });

    console.log('Usuario administrador creado exitosamente:');
    console.log('Username:', username);
    console.log('Email:', email);
    console.log('Password:', password);
    console.log('UUID:', user.user_uuid);

  } catch (error) {
    console.error('Error creando usuario administrador:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
