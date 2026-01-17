import User from '../models/User.js';
import Repository from '../models/Repository.js';

// @desc    Get user profile
// @route   GET /api/users/:username
// @access  Public
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate('followers', 'username avatar')
      .populate('following', 'username avatar');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.getPublicProfile());
  } catch (error) {
    console.error('Get User Profile Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update allowed fields
    user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
    user.location = req.body.location !== undefined ? req.body.location : user.location;
    user.website = req.body.website !== undefined ? req.body.website : user.website;
    user.twitter = req.body.twitter !== undefined ? req.body.twitter : user.twitter;
    user.company = req.body.company !== undefined ? req.body.company : user.company;

    const updatedUser = await user.save();
    res.json(updatedUser.getPublicProfile());
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Follow user
// @route   POST /api/users/:userId/follow
// @access  Private
export const followUser = async (req, res) => {
  try {
    const userToFollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (userToFollow._id.toString() === currentUser._id.toString()) {
      return res.status(400).json({ message: 'Cannot follow yourself' });
    }

    // Check if already following
    if (currentUser.following.includes(userToFollow._id)) {
      return res.status(400).json({ message: 'Already following this user' });
    }

    // Add to following and followers
    currentUser.following.push(userToFollow._id);
    userToFollow.followers.push(currentUser._id);

    await currentUser.save();
    await userToFollow.save();

    res.json({ 
      message: 'User followed successfully',
      following: true 
    });
  } catch (error) {
    console.error('Follow User Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unfollow user
// @route   DELETE /api/users/:userId/follow
// @access  Private
export const unfollowUser = async (req, res) => {
  try {
    const userToUnfollow = await User.findById(req.params.userId);
    const currentUser = await User.findById(req.user._id);

    if (!userToUnfollow) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove from following and followers
    currentUser.following = currentUser.following.filter(
      id => id.toString() !== userToUnfollow._id.toString()
    );

    userToUnfollow.followers = userToUnfollow.followers.filter(
      id => id.toString() !== currentUser._id.toString()
    );

    await currentUser.save();
    await userToUnfollow.save();

    res.json({ 
      message: 'User unfollowed successfully',
      following: false 
    });
  } catch (error) {
    console.error('Unfollow User Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user followers
// @route   GET /api/users/:username/followers
// @access  Public
export const getFollowers = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate('followers', 'username avatar bio location');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.followers);
  } catch (error) {
    console.error('Get Followers Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user following
// @route   GET /api/users/:username/following
// @access  Public
export const getFollowing = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate('following', 'username avatar bio location');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.following);
  } catch (error) {
    console.error('Get Following Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search users
// @route   GET /api/users/search
// @access  Public
export const searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: 'i' } },
        { bio: { $regex: q, $options: 'i' } },
        { company: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } }
      ]
    })
    .select('-password')
    .limit(30);

    res.json(users);
  } catch (error) {
    console.error('User Search Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user statistics
// @route   GET /api/users/:username/stats
// @access  Public
export const getUserStats = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const repos = await Repository.find({ owner: user._id });
    
    const stats = {
      totalRepos: repos.length,
      publicRepos: repos.filter(r => !r.isPrivate).length,
      privateRepos: repos.filter(r => r.isPrivate).length,
      totalStars: repos.reduce((sum, repo) => sum + (repo.stars?.length || 0), 0),
      totalForks: repos.reduce((sum, repo) => sum + (repo.forks?.length || 0), 0),
      followers: user.followers.length,
      following: user.following.length,
      languages: [...new Set(repos.map(r => r.language).filter(Boolean))]
    };

    res.json(stats);
  } catch (error) {
    console.error('Get User Stats Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user activity
// @route   GET /api/users/:username/activity
// @access  Public
export const getUserActivity = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get recent repositories
    const recentRepos = await Repository.find({ owner: user._id })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name description createdAt');

    // This is a simplified version - you can expand with commits, stars, etc.
    const activity = {
      recentRepos,
      joinedDate: user.createdAt
    };

    res.json(activity);
  } catch (error) {
    console.error('Get User Activity Error:', error);
    res.status(500).json({ message: error.message });
  }
};