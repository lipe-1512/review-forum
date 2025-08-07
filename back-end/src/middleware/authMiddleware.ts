import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'dev-secret', (err, decoded: any) => {
    if (err) {
      return res.status(401).json({ message: 'Token inválido ou expirado' });
    }
    res.locals.userId = decoded.userId;
    next();
  });
};
