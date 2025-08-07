import { Router, Request, Response } from 'express';
import { UserListService } from '../services/UserListService';

const userListRoutes = Router();

// ✅ Cenário 6: Adicionar item à lista
userListRoutes.post('/', async (req: Request, res: Response) => {
    try {
        const { userId, movieId, listType } = req.body;
        const newItem = await UserListService.addItemToList(userId, movieId, listType);
        res.status(201).json(newItem);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

// ✅ Cenário 7: Remover item da lista
userListRoutes.delete('/', async (req: Request, res: Response) => {
    try {
        const { userId, movieId, listType } = req.body;
        await UserListService.removeItemFromList(userId, movieId, listType);
        res.status(204).send();
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

// Obter uma lista específica de um usuário
userListRoutes.get('/:userId/:listType', async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        const listType = req.params.listType;
        const list = await UserListService.getUserList(userId, listType);
        res.status(200).json(list);
    } catch (error: any) {
        res.status(500).json({ message: "Erro ao buscar a lista do usuário." });
    }
});

export default userListRoutes;