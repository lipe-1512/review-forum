import { Router } from 'express';
import { ReviewService } from '../services/ReviewService';

export const reviewRoutes = Router();

reviewRoutes.get('/', async (req, res) => {
  try {
    const reviews = await ReviewService.getAllReviews();
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

reviewRoutes.get('/:id', async (req, res) => {
  try {
    const review = await ReviewService.getById(parseInt(req.params.id));
    res.json(review);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
});

reviewRoutes.post('/', async (req, res) => {
  try {
    const review = await ReviewService.createReview(req.body);
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

reviewRoutes.put('/:id', async (req, res) => {
  try {
    const review = await ReviewService.updateReview(req.body);
    res.json(review);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

reviewRoutes.delete('/:id', async (req, res) => {
  try {
    await ReviewService.deleteReview(parseInt(req.params.id));
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});
