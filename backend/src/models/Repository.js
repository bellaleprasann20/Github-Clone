import mongoose from 'mongoose';

const repositorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Repository name is required'],
    trim: true,
    maxlength: 100
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    maxlength: 500
  },
  isPrivate: {
    type: Boolean,
    default: false
  },
  language: {
    type: String,
    trim: true
  },
  topics: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  stars: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  watchers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  forks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Repository'
  }],
  forkedFrom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Repository'
  },
  defaultBranch: {
    type: String,
    default: 'main'
  },
  branches: [{
    name: String,
    lastCommit: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Commit'
    }
  }],
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['read', 'write', 'admin'],
      default: 'read'
    }
  }],
  size: {
    type: Number,
    default: 0
  },
  openIssues: {
    type: Number,
    default: 0
  },
  hasReadme: {
    type: Boolean,
    default: false
  },
  license: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
repositorySchema.index({ owner: 1, name: 1 }, { unique: true });
repositorySchema.index({ topics: 1 });
repositorySchema.index({ language: 1 });

// Virtual for star count
repositorySchema.virtual('starCount').get(function() {
  return this.stars.length;
});

// Virtual for fork count
repositorySchema.virtual('forkCount').get(function() {
  return this.forks.length;
});

// Virtual for watcher count
repositorySchema.virtual('watcherCount').get(function() {
  return this.watchers.length;
});

const Repository = mongoose.model('Repository', repositorySchema);

export default Repository;