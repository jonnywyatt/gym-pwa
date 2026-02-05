import { Router } from 'express';
import { authenticate } from '../../middleware/auth';
import { createBodyWeight, getLatestBodyWeight, getUserById } from './queries';
import { transformUserProfile } from './transforms';

const router = Router();

router.get('/users/:userId', authenticate, async (req, res) => {
  try {
    const userId = parseInt(String(req.params.userId), 10);
    if (Number.isNaN(userId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    if (userId !== req.user?.userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const user = await getUserById(userId);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const latestBodyWeight = await getLatestBodyWeight(userId);
    const profile = transformUserProfile(user, latestBodyWeight);
    res.json(profile);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.post('/users/:userId/body-weights', authenticate, async (req, res) => {
  try {
    const userId = parseInt(String(req.params.userId), 10);
    if (Number.isNaN(userId)) {
      res.status(400).json({ error: 'Invalid user ID' });
      return;
    }

    if (userId !== req.user?.userId) {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }

    const { weight } = req.body;
    if (typeof weight !== 'number' || weight <= 0) {
      res.status(400).json({ error: 'Weight must be a positive number' });
      return;
    }

    const bodyWeight = await createBodyWeight(userId, weight);
    res.status(201).json({
      weight: bodyWeight.weight.toString(),
      unit: bodyWeight.unit,
    });
  } catch (error) {
    console.error('Error saving body weight:', error);
    res.status(500).json({ error: 'Failed to save body weight' });
  }
});

export default router;
