import { Router } from 'express';

const router = Router();

// Define list-related routes here
router.get('/', (req, res) => {
  res.send('List route');
});

export default router;
