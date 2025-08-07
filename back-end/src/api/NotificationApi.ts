import { Router, Request, Response } from 'express';
import { NotificationService } from '../services/NotificationService';

const notificationRoutes = Router();

notificationRoutes.get('/:userId', async (req: Request, res: Response) => {
    // Lógica para chamar o NotificationService e buscar notificações
});

notificationRoutes.patch('/:notificationId/read', async (req: Request, res: Response) => {
    // Lógica para marcar uma notificação como lida
});

export default notificationRoutes;