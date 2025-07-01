import { NextApiRequest, NextApiResponse } from 'next';
import { withAuth, AuthenticatedRequest } from '../../../lib/auth';

async function handler(req: AuthenticatedRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    res.status(200).json({
      message: 'Sesión válida',
      user: req.user
    });
  } catch (error) {
    console.error('Error verificando sesión:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
}

export default withAuth(handler);
