import express from 'express';
import {
  getRepoCommits,
  createCommit,
  getCommitBySha,
  getCommitsByAuthor,
  deleteCommit,
  getCommitStats
} from '../controllers/commitController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /api/commits/:repoId
// @desc    Get all commits for a repository
// @access  Public/Private (depends on repo visibility)
router.get('/:repoId', getRepoCommits);

// @route   POST /api/commits
// @desc    Create a new commit
// @access  Private
router.post('/', protect, createCommit);

// @route   GET /api/commits/sha/:sha
// @desc    Get commit by SHA hash
// @access  Public/Private (depends on repo visibility)
router.get('/sha/:sha', getCommitBySha);

// @route   GET /api/commits/author/:username
// @desc    Get all commits by a specific author
// @access  Public
router.get('/author/:username', getCommitsByAuthor);

// @route   DELETE /api/commits/:id
// @desc    Delete a commit (owner only)
// @access  Private
router.delete('/:id', protect, deleteCommit);

// @route   GET /api/commits/:repoId/stats
// @desc    Get commit statistics for a repository
// @access  Public/Private (depends on repo visibility)
router.get('/:repoId/stats', getCommitStats);

export default router;