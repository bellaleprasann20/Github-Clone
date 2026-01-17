export const checkRepoAccess = async (req, res, next) => {
  try {
    const { repo } = req;
    const userId = req.user._id;

    // Owner has full access
    if (repo.owner.toString() === userId.toString()) {
      req.userRole = 'admin';
      return next();
    }

    // Check if user is a collaborator
    const collaborator = repo.collaborators.find(
      c => c.user.toString() === userId.toString()
    );

    if (collaborator) {
      req.userRole = collaborator.role;
      return next();
    }

    // If repo is public, user has read access
    if (!repo.isPrivate) {
      req.userRole = 'read';
      return next();
    }

    // No access
    return res.status(403).json({ message: 'Access denied' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error' });
  }
};

export const requireRole = (requiredRole) => {
  return (req, res, next) => {
    const roleHierarchy = { read: 0, write: 1, admin: 2 };

    if (roleHierarchy[req.userRole] >= roleHierarchy[requiredRole]) {
      return next();
    }

    return res.status(403).json({ message: 'Insufficient permissions' });
  };
};