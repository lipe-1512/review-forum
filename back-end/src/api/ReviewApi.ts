import { Router, Request, Response } from 'express';
import { ReviewService } from '../services/ReviewService';

const reviewRoutes = Router();

// ✅ Cenário 9: Obter reviews de um usuário
reviewRoutes.get('/user/:userId', async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        const reviews = await ReviewService.getReviewsByUser(userId);
        res.status(200).json(reviews);
    } catch (error: any) {
        res.status(500).json({ message: 'Erro ao buscar reviews do usuário.' });
    }
});

// Criar uma nova review
reviewRoutes.post('/', async (req: Request, res: Response) => {
    try {
        // Supondo que o corpo da requisição terá { userId, movieId, rating, comment }
        const { userId, movieId, rating, comment } = req.body;
        const newReview = await ReviewService.createReview(userId, movieId, { rating, comment });
        res.status(201).json(newReview);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

export default reviewRoutes;