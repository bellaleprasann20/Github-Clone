import mongoose from 'mongoose';

const commitSchema = new mongoose.Schema({
  repository: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Repository',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: [true, 'Commit message is required'],
    trim: true
  },
  branch: {
    type: String,
    default: 'main'
  },
  sha: {
    type: String,
    required: true,
    unique: true  // Remove index: true if you have it here
  },
  parentCommits: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Commit'
  }],
  files: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  }],
  additions: {
    type: Number,
    default: 0
  },
  deletions: {
    type: Number,
    default: 0
  },
  changedFiles: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes - only define once, not both here and in schema definition
commitSchema.index({ repository: 1, branch: 1 });
commitSchema.index({ author: 1 });
// Don't add sha index here if it's marked as unique above

const Commit = mongoose.model('Commit', commitSchema);

export default Commit;