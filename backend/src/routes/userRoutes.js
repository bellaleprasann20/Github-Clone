import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowing,
  searchUsers  // NEW
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Search route
router.get('/search', searchUsers);

router.get('/:username', getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/:userId/follow', protect, followUser);
router.delete('/:userId/follow', protect, unfollowUser);
router.get('/:username/followers', getFollowers);
router.get('/:username/following', getFollowing);

export default router;