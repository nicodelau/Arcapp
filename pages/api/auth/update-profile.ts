import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'PUT') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    try {
        const { username, email, nombre, apellido, currentPassword, newPassword } = req.body;

        // Verificar token de autenticación en el header Authorization
        const authHeader = req.headers.authorization;
        console.log('Auth header:', authHeader ? 'Present' : 'Missing');
        
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            console.log('No authorization header or invalid format');
            return res.status(401).json({ message: 'No autorizado - Token requerido' });
        }

        const token = authHeader.replace('Bearer ', '');
        
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET) as any;
            console.log('Token decoded successfully for user:', decoded.userId);
        } catch (error) {
            console.log('Token verification failed:', error);
            return res.status(401).json({ message: 'Token inválido' });
        }

        const userId = decoded.userId;

        // Buscar el usuario actual
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        // Verificar si el nuevo username o email ya están en uso por otro usuario
        if (username !== user.username) {
            const existingUsername = await prisma.user.findUnique({
                where: { username }
            });
            if (existingUsername && existingUsername.id !== userId) {
                return res.status(400).json({ message: 'El nombre de usuario ya está en uso' });
            }
        }

        if (email !== user.user_email) {
            const existingEmail = await prisma.user.findUnique({
                where: { user_email: email }
            });
            if (existingEmail && existingEmail.id !== userId) {
                return res.status(400).json({ message: 'El correo electrónico ya está en uso' });
            }
        }

        // Preparar datos para actualizar
        const updateData: any = {
            username,
            user_email: email,
            updatedAt: new Date()
        };

        // Solo agregar nombre y apellido si están definidos
        if (nombre !== undefined) {
            updateData.nombre = nombre || null;
        }
        if (apellido !== undefined) {
            updateData.apellido = apellido || null;
        }

        // Si se quiere cambiar la contraseña
        if (newPassword && currentPassword) {
            // Verificar contraseña actual
            const isValidPassword = await bcrypt.compare(currentPassword, user.user_password);
            if (!isValidPassword) {
                return res.status(400).json({ message: 'Contraseña actual incorrecta' });
            }

            // Hashear nueva contraseña
            const hashedNewPassword = await bcrypt.hash(newPassword, 10);
            updateData.user_password = hashedNewPassword;
        }

        // Actualizar usuario
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: {
                id: true,   
                username: true,
                user_email: true,
                nombre: true,
                apellido: true,
                createdAt: true,
                updatedAt: true
            }
        });

        console.log(updatedUser);

        return res.status(200).json({
            message: 'Perfil actualizado correctamente',
            user: updatedUser
        });

    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        return res.status(500).json({ message: 'Error interno del servidor' });
    }
}
