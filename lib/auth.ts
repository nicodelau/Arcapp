import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    userId: number;
    userUuid: string;
    username: string;
    user_email: string;
  };
}

export function verifyToken(req: AuthenticatedRequest, res: NextApiResponse, next: Function) {
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'Token de acceso requerido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.user = {
      userId: decoded.userId,
      userUuid: decoded.userUuid,
      username: decoded.username,
      user_email: decoded.user_email
    };
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token inválido' });
  }
}

export function withAuth(handler: Function) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    return new Promise((resolve, reject) => {
      verifyToken(req, res, () => {
        handler(req, res).then(resolve).catch(reject);
      });
    });
  };
}
