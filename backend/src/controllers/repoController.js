import Repository from '../models/Repository.js';
import User from '../models/User.js';
import File from '../models/File.js';
import crypto from 'crypto';

// @desc    Get all repositories
// @route   GET /api/repos
// @access  Public
export const getAllRepos = async (req, res) => {
  try {
    const { page = 1, limit = 20, language, sort = 'created' } = req.query;

    const query = { isPrivate: false };

    if (language) {
      query.language = language;
    }

    let sortOption = {};
    switch (sort) {
      case 'stars':
        sortOption = { stars: -1 };
        break;
      case 'forks':
        sortOption = { forks: -1 };
        break;
      case 'updated':
        sortOption = { updatedAt: -1 };
        break;
      default:
        sortOption = { createdAt: -1 };
    }

    const repos = await Repository.find(query)
      .populate('owner', 'username avatar')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Repository.countDocuments(query);

    res.json({
      repos,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get All Repos Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user repositories
// @route   GET /api/repos/user/:username
// @access  Public
export const getUserRepos = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const query = { owner: user._id };

    // If not the owner, only show public repos
    if (!req.user || req.user._id.toString() !== user._id.toString()) {
      query.isPrivate = false;
    }

    const repos = await Repository.find(query)
      .populate('owner', 'username avatar')
      .sort({ updatedAt: -1 });

    // Populate files for each repository
    const reposWithFiles = await Promise.all(
      repos.map(async (repo) => {
        const files = await File.find({ repository: repo._id });
        return {
          ...repo.toObject(),
          files: files
        };
      })
    );

    res.json(reposWithFiles);
  } catch (error) {
    console.error('Get User Repos Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get repository by ID
// @route   GET /api/repos/:id
// @access  Public/Private
export const getRepoById = async (req, res) => {
  try {
    const repo = await Repository.findById(req.params.id)
      .populate('owner', 'username avatar')
      .populate('stars', 'username avatar')
      .populate('watchers', 'username avatar');

    if (!repo) {
      return res.status(404).json({ message: 'Repository not found' });
    }

    // Check if user has access to private repo
    if (repo.isPrivate) {
      if (!req.user || 
          (repo.owner._id.toString() !== req.user._id.toString() &&
           !repo.collaborators.some(c => c.user.toString() === req.user._id.toString()))) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    // Get files for this repository
    const files = await File.find({ repository: repo._id });

    const repoWithFiles = {
      ...repo.toObject(),
      files: files
    };

    res.json(repoWithFiles);
  } catch (error) {
    console.error('Get Repo Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new repository
// @route   POST /api/repos
// @access  Private
export const createRepo = async (req, res) => {
  try {
    const { name, description, isPrivate, language, topics, initializeWithReadme, files } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: 'Repository name is required' });
    }

    // Validate repository name
    const repoNameRegex = /^[a-zA-Z0-9._-]+$/;
    if (!repoNameRegex.test(name)) {
      return res.status(400).json({ 
        message: 'Repository name can only contain letters, numbers, dots, hyphens, and underscores' 
      });
    }

    // Check if repo already exists
    const repoExists = await Repository.findOne({
      owner: req.user._id,
      name: name.toLowerCase()
    });

    if (repoExists) {
      return res.status(400).json({ message: 'Repository already exists' });
    }

    // Create repository
    const repo = await Repository.create({
      name: name.toLowerCase(),
      owner: req.user._id,
      description: description || '',
      isPrivate: isPrivate || false,
      language: language || '',
      topics: topics || [],
      hasReadme: initializeWithReadme || false,
      branches: [{ name: 'main' }]
    });

    // Save uploaded files if any
    let savedFiles = [];
    if (files && files.length > 0) {
      const fileDocuments = files.map(file => ({
        repository: repo._id,
        name: file.name,
        path: file.name,
        type: 'file',
        content: file.content,
        size: file.size || file.content.length,
        language: file.language || 'Text',
        extension: file.extension || file.name.split('.').pop(),
        branch: 'main'
      }));

      savedFiles = await File.insertMany(fileDocuments);
      console.log(`✅ Saved ${savedFiles.length} files for repository ${repo.name}`);
    }

    // Create README if requested
    if (initializeWithReadme) {
      const readmeContent = `# ${name}\n\n${description || 'A new repository'}\n\n## About\n\nThis repository was created on GitHub Clone.\n\n## Getting Started\n\nAdd your project description here.\n\n## License\n\nMIT`;
      
      const readmeFile = await File.create({
        repository: repo._id,
        name: 'README.md',
        path: 'README.md',
        type: 'file',
        content: readmeContent,
        size: readmeContent.length,
        language: 'Markdown',
        extension: 'md',
        branch: 'main'
      });
      
      savedFiles.push(readmeFile);
    }

    const populatedRepo = await Repository.findById(repo._id)
      .populate('owner', 'username avatar');

    // Return repo with files
    res.status(201).json({
      ...populatedRepo.toObject(),
      files: savedFiles
    });
  } catch (error) {
    console.error('Create Repo Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update repository
// @route   PUT /api/repos/:id
// @access  Private
export const updateRepo = async (req, res) => {
  try {
    const repo = await Repository.findById(req.params.id);

    if (!repo) {
      return res.status(404).json({ message: 'Repository not found' });
    }

    // Check ownership
    if (repo.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this repository' });
    }

    const { description, isPrivate, language, topics, defaultBranch } = req.body;

    repo.description = description !== undefined ? description : repo.description;
    repo.isPrivate = isPrivate !== undefined ? isPrivate : repo.isPrivate;
    repo.language = language !== undefined ? language : repo.language;
    repo.topics = topics !== undefined ? topics : repo.topics;
    repo.defaultBranch = defaultBranch !== undefined ? defaultBranch : repo.defaultBranch;

    const updatedRepo = await repo.save();

    const populatedRepo = await Repository.findById(updatedRepo._id)
      .populate('owner', 'username avatar');

    res.json(populatedRepo);
  } catch (error) {
    console.error('Update Repo Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete repository
// @route   DELETE /api/repos/:id
// @access  Private
export const deleteRepo = async (req, res) => {
  try {
    const repo = await Repository.findById(req.params.id);

    if (!repo) {
      return res.status(404).json({ message: 'Repository not found' });
    }

    // Check ownership
    if (repo.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this repository' });
    }

    // Delete all files associated with this repo
    await File.deleteMany({ repository: repo._id });

    await repo.deleteOne();

    res.json({ message: 'Repository and associated files removed successfully' });
  } catch (error) {
    console.error('Delete Repo Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Star repository
// @route   POST /api/repos/:id/star
// @access  Private
export const starRepo = async (req, res) => {
  try {
    const repo = await Repository.findById(req.params.id);

    if (!repo) {
      return res.status(404).json({ message: 'Repository not found' });
    }

    // Check if already starred
    const alreadyStarred = repo.stars.some(
      id => id.toString() === req.user._id.toString()
    );

    if (alreadyStarred) {
      // Unstar
      repo.stars = repo.stars.filter(
        id => id.toString() !== req.user._id.toString()
      );
      await repo.save();
      
      return res.json({ 
        message: 'Repository unstarred', 
        starred: false, 
        stars: repo.stars.length 
      });
    }

    // Star
    repo.stars.push(req.user._id);
    await repo.save();

    res.json({ 
      message: 'Repository starred', 
      starred: true, 
      stars: repo.stars.length 
    });
  } catch (error) {
    console.error('Star Repo Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fork repository
// @route   POST /api/repos/:id/fork
// @access  Private
export const forkRepo = async (req, res) => {
  try {
    const originalRepo = await Repository.findById(req.params.id)
      .populate('owner', 'username');

    if (!originalRepo) {
      return res.status(404).json({ message: 'Repository not found' });
    }

    // Check if already forked
    const existingFork = await Repository.findOne({
      owner: req.user._id,
      forkedFrom: originalRepo._id
    });

    if (existingFork) {
      return res.status(400).json({ 
        message: 'You have already forked this repository',
        fork: existingFork 
      });
    }

    // Create fork with unique name if needed
    let forkName = originalRepo.name;
    const existingRepoWithSameName = await Repository.findOne({
      owner: req.user._id,
      name: forkName
    });

    if (existingRepoWithSameName) {
      forkName = `${originalRepo.name}-fork`;
    }

    // Create fork
    const fork = await Repository.create({
      name: forkName,
      owner: req.user._id,
      description: originalRepo.description,
      isPrivate: false, // Forks are always public
      language: originalRepo.language,
      topics: originalRepo.topics,
      forkedFrom: originalRepo._id,
      branches: originalRepo.branches,
      hasReadme: originalRepo.hasReadme
    });

    // Copy files from original repo
    const originalFiles = await File.find({ repository: originalRepo._id });
    if (originalFiles.length > 0) {
      const forkedFiles = originalFiles.map(file => ({
        repository: fork._id,
        name: file.name,
        path: file.path,
        type: file.type,
        content: file.content,
        size: file.size,
        language: file.language,
        extension: file.extension,
        branch: file.branch
      }));

      await File.insertMany(forkedFiles);
      console.log(`✅ Copied ${forkedFiles.length} files to forked repository`);
    }

    // Update original repo forks array
    originalRepo.forks.push(fork._id);
    await originalRepo.save();

    const populatedFork = await Repository.findById(fork._id)
      .populate('owner', 'username avatar');

    res.status(201).json(populatedFork);
  } catch (error) {
    console.error('Fork Repo Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search repositories
// @route   GET /api/repos/search
// @access  Public
export const searchRepos = async (req, res) => {
  try {
    const { q, language, sort = 'best-match' } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    // Build search query
    const searchQuery = {
      isPrivate: false,
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { topics: { $in: [new RegExp(q, 'i')] } }
      ]
    };

    // Add language filter
    if (language) {
      searchQuery.language = language;
    }

    // Execute search
    let repos = await Repository.find(searchQuery)
      .populate('owner', 'username avatar')
      .limit(100);

    // Sort results
    if (sort === 'stars') {
      repos.sort((a, b) => (b.stars?.length || 0) - (a.stars?.length || 0));
    } else if (sort === 'forks') {
      repos.sort((a, b) => (b.forks?.length || 0) - (a.forks?.length || 0));
    } else if (sort === 'updated') {
      repos.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    }

    res.json(repos);
  } catch (error) {
    console.error('Search Repos Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get trending repositories
// @route   GET /api/repos/trending
// @access  Public
export const getTrendingRepos = async (req, res) => {
  try {
    const { language, since = 'week' } = req.query;

    let dateLimit = new Date();
    switch (since) {
      case 'day':
        dateLimit.setDate(dateLimit.getDate() - 1);
        break;
      case 'week':
        dateLimit.setDate(dateLimit.getDate() - 7);
        break;
      case 'month':
        dateLimit.setMonth(dateLimit.getMonth() - 1);
        break;
      default:
        dateLimit.setDate(dateLimit.getDate() - 7);
    }

    const query = {
      isPrivate: false,
      createdAt: { $gte: dateLimit }
    };

    if (language) {
      query.language = language;
    }

    const repos = await Repository.find(query)
      .populate('owner', 'username avatar')
      .sort({ stars: -1 })
      .limit(25);

    res.json(repos);
  } catch (error) {
    console.error('Get Trending Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Watch/Unwatch repository
// @route   POST /api/repos/:id/watch
// @access  Private
export const watchRepo = async (req, res) => {
  try {
    const repo = await Repository.findById(req.params.id);

    if (!repo) {
      return res.status(404).json({ message: 'Repository not found' });
    }

    const alreadyWatching = repo.watchers.some(
      id => id.toString() === req.user._id.toString()
    );

    if (alreadyWatching) {
      // Unwatch
      repo.watchers = repo.watchers.filter(
        id => id.toString() !== req.user._id.toString()
      );
      await repo.save();
      
      return res.json({ 
        message: 'Repository unwatched', 
        watching: false, 
        watchers: repo.watchers.length 
      });
    }

    // Watch
    repo.watchers.push(req.user._id);
    await repo.save();

    res.json({ 
      message: 'Repository watched', 
      watching: true, 
      watchers: repo.watchers.length 
    });
  } catch (error) {
    console.error('Watch Repo Error:', error);
    res.status(500).json({ message: error.message });
  }
};