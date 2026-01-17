import Commit from '../models/Commit.js';
import Repository from '../models/Repository.js';
import crypto from 'crypto';

// @desc    Get repository commits
// @route   GET /api/commits/:repoId
// @access  Public/Private
export const getRepoCommits = async (req, res) => {
  try {
    const { repoId } = req.params;
    const { branch = 'main', page = 1, limit = 30 } = req.query;

    const repo = await Repository.findById(repoId);
    if (!repo) {
      return res.status(404).json({ message: 'Repository not found' });
    }

    // Check if user has access to private repo
    if (repo.isPrivate) {
      if (!req.user || 
          (repo.owner.toString() !== req.user._id.toString() &&
           !repo.collaborators.some(c => c.user.toString() === req.user._id.toString()))) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    const commits = await Commit.find({ repository: repoId, branch })
      .populate('author', 'username avatar')
      .populate('parentCommits', 'sha message createdAt')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const count = await Commit.countDocuments({ repository: repoId, branch });

    res.json({
      commits,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new commit
// @route   POST /api/commits
// @access  Private
export const createCommit = async (req, res) => {
  try {
    const { repositoryId, message, branch = 'main', files, additions, deletions } = req.body;

    // Validate commit message
    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: 'Commit message is required' });
    }

    const repo = await Repository.findById(repositoryId);
    if (!repo) {
      return res.status(404).json({ message: 'Repository not found' });
    }

    // Check if user has write access
    const hasAccess = 
      repo.owner.toString() === req.user._id.toString() ||
      repo.collaborators.some(
        c => c.user.toString() === req.user._id.toString() && 
        ['write', 'admin'].includes(c.role)
      );

    if (!hasAccess) {
      return res.status(403).json({ message: 'You do not have permission to commit to this repository' });
    }

    // Check if branch exists
    const branchExists = repo.branches.some(b => b.name === branch);
    if (!branchExists) {
      return res.status(400).json({ message: `Branch '${branch}' does not exist` });
    }

    // Generate unique SHA for commit
    const sha = crypto.createHash('sha1')
      .update(message + Date.now() + req.user._id + repositoryId)
      .digest('hex');

    // Get parent commit (last commit on this branch)
    const parentCommit = await Commit.findOne({ 
      repository: repositoryId, 
      branch 
    }).sort({ createdAt: -1 });

    const commit = await Commit.create({
      repository: repositoryId,
      author: req.user._id,
      message: message.trim(),
      branch,
      sha,
      parentCommits: parentCommit ? [parentCommit._id] : [],
      files: files || [],
      additions: additions || 0,
      deletions: deletions || 0,
      changedFiles: files?.length || 0
    });

    // Update repository's last commit for this branch
    const branchIndex = repo.branches.findIndex(b => b.name === branch);
    if (branchIndex !== -1) {
      repo.branches[branchIndex].lastCommit = commit._id;
      await repo.save();
    }

    const populatedCommit = await Commit.findById(commit._id)
      .populate('author', 'username avatar email')
      .populate('parentCommits', 'sha message');

    res.status(201).json(populatedCommit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get commit by SHA
// @route   GET /api/commits/sha/:sha
// @access  Public/Private
export const getCommitBySha = async (req, res) => {
  try {
    const commit = await Commit.findOne({ sha: req.params.sha })
      .populate('author', 'username avatar email')
      .populate('repository', 'name owner isPrivate')
      .populate('parentCommits', 'sha message author createdAt')
      .populate('files');

    if (!commit) {
      return res.status(404).json({ message: 'Commit not found' });
    }

    // Check access for private repos
    if (commit.repository.isPrivate) {
      if (!req.user || commit.repository.owner.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json(commit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get commits by author
// @route   GET /api/commits/author/:username
// @access  Public
export const getCommitsByAuthor = async (req, res) => {
  try {
    const { username } = req.params;
    const { page = 1, limit = 30 } = req.query;

    // Find user by username
    const User = (await import('../models/User.js')).default;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const commits = await Commit.find({ author: user._id })
      .populate('author', 'username avatar')
      .populate('repository', 'name owner')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Commit.countDocuments({ author: user._id });

    res.json({
      commits,
      totalPages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      total: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete commit (admin only - dangerous operation)
// @route   DELETE /api/commits/:id
// @access  Private
export const deleteCommit = async (req, res) => {
  try {
    const commit = await Commit.findById(req.params.id).populate('repository');

    if (!commit) {
      return res.status(404).json({ message: 'Commit not found' });
    }

    // Only repo owner can delete commits
    if (commit.repository.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only repository owner can delete commits' });
    }

    await commit.deleteOne();

    res.json({ message: 'Commit deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get commit statistics for a repository
// @route   GET /api/commits/:repoId/stats
// @access  Public/Private
export const getCommitStats = async (req, res) => {
  try {
    const { repoId } = req.params;
    const { days = 30 } = req.query;

    const repo = await Repository.findById(repoId);
    if (!repo) {
      return res.status(404).json({ message: 'Repository not found' });
    }

    // Check access for private repos
    if (repo.isPrivate && (!req.user || repo.owner.toString() !== req.user._id.toString())) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const dateFrom = new Date();
    dateFrom.setDate(dateFrom.getDate() - parseInt(days));

    // Get commits in date range
    const commits = await Commit.find({
      repository: repoId,
      createdAt: { $gte: dateFrom }
    }).populate('author', 'username');

    // Calculate statistics
    const stats = {
      totalCommits: commits.length,
      totalAdditions: commits.reduce((sum, c) => sum + (c.additions || 0), 0),
      totalDeletions: commits.reduce((sum, c) => sum + (c.deletions || 0), 0),
      contributors: [...new Set(commits.map(c => c.author.username))].length,
      commitsByDate: {},
      topContributors: {}
    };

    // Group by date
    commits.forEach(commit => {
      const date = commit.createdAt.toISOString().split('T')[0];
      stats.commitsByDate[date] = (stats.commitsByDate[date] || 0) + 1;

      // Count by contributor
      const username = commit.author.username;
      if (!stats.topContributors[username]) {
        stats.topContributors[username] = {
          username,
          commits: 0,
          additions: 0,
          deletions: 0
        };
      }
      stats.topContributors[username].commits++;
      stats.topContributors[username].additions += commit.additions || 0;
      stats.topContributors[username].deletions += commit.deletions || 0;
    });

    // Convert to array and sort
    stats.topContributors = Object.values(stats.topContributors)
      .sort((a, b) => b.commits - a.commits)
      .slice(0, 10);

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};