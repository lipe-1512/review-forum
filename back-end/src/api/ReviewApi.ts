import { Router, Request, Response } from 'express';
import { ReviewService } from '../services/ReviewService';

const reviewRoutes = Router();

// Buscar reviews de um filme específico
reviewRoutes.get('/movie/:movieId', async (req: Request, res: Response) => {
    try {
        const movieId = parseInt(req.params.movieId);
        const reviews = await ReviewService.getReviewsByMovieId(movieId);
        res.status(200).json(reviews);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
});

// Buscar reviews de um usuário específico
reviewRoutes.get('/user/:userId', async (req: Request, res: Response) => {
    try {
        const userId = parseInt(req.params.userId);
        const reviews = await ReviewService.getReviewsByUserId(userId);
        res.status(200).json(reviews);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
});

// Criar uma nova review (requer autenticação)
reviewRoutes.post('/', async (req: Request, res: Response) => {
    try {
        const { userId, movieId, rating, comment } = req.body;
        const review = await ReviewService.createReview(userId, movieId, { rating, comment });
        res.status(201).json(review);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

// Deletar uma review (requer autenticação e permissão)
reviewRoutes.delete('/:id', async (req: Request, res: Response) => {
    try {
        const reviewId = parseInt(req.params.id);
        const { userId } = req.body; // ID do usuário logado
        await ReviewService.deleteReview(reviewId, userId);
        res.status(204).send();
    } catch (error: any) {
        res.status(403).json({ message: error.message });
    }
});

export default reviewRoutes;