import mongoose from 'mongoose';

const fileSchema = new mongoose.Schema({
  repository: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Repository',
    required: true
  },
  path: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['file', 'directory'],
    default: 'file'
  },
  content: {
    type: String
  },
  size: {
    type: Number,
    default: 0
  },
  encoding: {
    type: String,
    default: 'utf-8'
  },
  language: String,
  extension: String,
  branch: {
    type: String,
    default: 'main'
  },
  lastCommit: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Commit'
  }
}, {
  timestamps: true
});

// Indexes
fileSchema.index({ repository: 1, path: 1, branch: 1 });
fileSchema.index({ repository: 1, type: 1 });

const File = mongoose.model('File', fileSchema);

export default File;