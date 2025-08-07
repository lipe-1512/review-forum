import { Router } from 'express';
import { UserService } from '../../backend/src/services/UserService';

const userRoutes = Router();

// Registro de usuário
userRoutes.post('/users/register', async (req, res) => {
  try {
    const user = await UserService.registerUser(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Login de usuário
userRoutes.post('/users/login', async (req, res) => {
  try {
    const token = await UserService.loginUser(req.body.email, req.body.password);
    res.json({ token });
  } catch (error: any) {
    res.status(401).json({ message: error.message });
  }
});

// Verificação de email via token
userRoutes.get('/users/verify-email', async (req, res) => {
  try {
    const token = req.query.token as string;
    await UserService.verifyEmail(token);
    res.json({ message: 'Email verificado com sucesso' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Recuperação de senha - envio de token
userRoutes.post('/users/forgot-password', async (req, res) => {
  try {
    await UserService.sendPasswordResetToken(req.body.email);
    res.json({ message: 'Token de recuperação enviado para o email' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Resetar senha via token
userRoutes.post('/users/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    await UserService.resetPassword(token, newPassword);
    res.json({ message: 'Senha atualizada com sucesso' });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

import { Request, Response, NextFunction } from 'express';

// Obter perfil do usuário autenticado
userRoutes.get('/users/profile', async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Aqui você deve extrair o usuário autenticado do token JWT (middleware não implementado aqui)
    // Para evitar erro de propriedade 'user' não existir, faça um cast
    const userId = (req as any).user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }
    const user = await UserService.getUserById(userId);
    res.json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

export { userRoutes };
