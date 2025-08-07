import express from 'express';
import { UserService } from '../services/UserService';

export const userRoutes = express.Router();

// Public routes
userRoutes.post('/register', async (req, res) => {
  try {
    const userData = req.body;
    const user = await UserService.registerUser(userData);
    res.status(201).json({ success: true, user });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

userRoutes.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await UserService.login(email, password);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(401).json({ success: false, error: (error as Error).message });
  }
});

// User management routes
userRoutes.put('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const userData = req.body;
    const updatedUser = await UserService.updateUser(userId, userData);
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

userRoutes.delete('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    await UserService.deleteAccount(userId);
    res.json({ success: true, message: 'Account deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

// Follow routes
userRoutes.post('/follow/:id', async (req, res) => {
  try {
    const followingId = parseInt(req.params.id);
    const { currentUserId } = req.body;
    const result = await UserService.followUser(currentUserId, followingId);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

userRoutes.delete('/follow/:id', async (req, res) => {
  try {
    const followingId = parseInt(req.params.id);
    const { currentUserId } = req.body;
    await UserService.unfollowUser(currentUserId, followingId);
    res.json({ success: true, message: 'Unfollowed successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

userRoutes.get('/:id/followers', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const followers = await UserService.getFollowers(userId);
    res.json({ success: true, followers });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

userRoutes.get('/:id/following', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const following = await UserService.getFollowing(userId);
    res.json({ success: true, following });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

// User list routes
userRoutes.post('/lists/:listName', async (req, res) => {
  try {
    const { listName } = req.params;
    const { currentUserId, itemData } = req.body;
    const result = await UserService.addItemToList(currentUserId, listName, itemData);
    res.json({ success: true, ...result });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

userRoutes.delete('/lists/:listName', async (req, res) => {
  try {
    const { listName } = req.params;
    const { currentUserId, itemData } = req.body;
    await UserService.removeItemFromList(currentUserId, listName, itemData);
    res.json({ success: true, message: 'Item removed from list successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

userRoutes.get('/:id/lists/:listName', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { listName } = req.params;
    const items = await UserService.getUserList(userId, listName);
    res.json({ success: true, items });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

// Get user profile
userRoutes.get('/:id', async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await UserService.getUserById(userId);
    res.json({ success: true, user });
  } catch (error) {
    res.status(404).json({ success: false, error: (error as Error).message });
  }
});
