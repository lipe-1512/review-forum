import { Router } from 'express';

const router = Router();

// Define follow-related routes here
router.get('/', (req, res) => {
  res.send('Follow route');
});

export default router;
