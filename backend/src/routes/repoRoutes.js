import express from 'express';
import {
  getAllRepos,
  getUserRepos,
  getRepoById,
  createRepo,
  updateRepo,
  deleteRepo,
  starRepo,
  forkRepo,
  searchRepos  // NEW
} from '../controllers/repoController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Search must come before /:id to avoid conflicts
router.get('/search', searchRepos);

router.get('/', getAllRepos);
router.get('/user/:username', getUserRepos);
router.get('/:id', getRepoById);
router.post('/', protect, createRepo);
router.put('/:id', protect, updateRepo);
router.delete('/:id', protect, deleteRepo);
router.post('/:id/star', protect, starRepo);
router.post('/:id/fork', protect, forkRepo);

export default router;