import { Router, Request, Response } from 'express';
import { UserListService } from '../services/UserListService';

const userListRoutes = Router();

// Buscar lista de um usuário
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

// Adicionar um item a uma lista
userListRoutes.post('/', async (req: Request, res: Response) => {
    try {
        const { userId, movieId, listType } = req.body;
        const newItem = await UserListService.addItemToList(userId, movieId, listType);
        res.status(201).json(newItem);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

// Remover um item de uma lista
userListRoutes.delete('/:id', async (req: Request, res: Response) => {
    try {
        const listItemId = parseInt(req.params.id);
        const { userId } = req.body; // ID do usuário logado, para verificação de permissão
        await UserListService.removeItemFromList(listItemId, userId);
        res.status(204).send();
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

export default userListRoutes;