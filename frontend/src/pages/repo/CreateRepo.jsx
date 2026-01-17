import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Globe, Upload, File, X } from 'lucide-react';
import { repoService } from '../../services/repoService';
import Button from '../../components/common/Button';
import { useAuth } from '../../hooks/useAuth';

const CreateRepo = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPrivate: false,
    initializeWithReadme: true,
    language: '',
    topics: ''
  });
  const [files, setFiles] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileUpload = (e) => {
    const uploadedFiles = Array.from(e.target.files);
    
    Promise.all(
      uploadedFiles.map(file => {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const extension = file.name.split('.').pop();
            resolve({
              name: file.name,
              content: event.target.result,
              size: file.size,
              extension: extension,
              language: detectLanguage(extension)
            });
          };
          reader.onerror = reject;
          reader.readAsText(file);
        });
      })
    ).then(filesData => {
      setFiles([...files, ...filesData]);
    }).catch(err => {
      setError('Error reading files');
    });
  };

  const detectLanguage = (extension) => {
    const languageMap = {
      'js': 'JavaScript',
      'jsx': 'JavaScript',
      'ts': 'TypeScript',
      'tsx': 'TypeScript',
      'py': 'Python',
      'java': 'Java',
      'cpp': 'C++',
      'c': 'C',
      'cs': 'C#',
      'php': 'PHP',
      'rb': 'Ruby',
      'go': 'Go',
      'rs': 'Rust',
      'swift': 'Swift',
      'kt': 'Kotlin',
      'html': 'HTML',
      'css': 'CSS',
      'md': 'Markdown',
      'json': 'JSON',
      'xml': 'XML',
      'sql': 'SQL'
    };
    return languageMap[extension.toLowerCase()] || 'Text';
  };

  const removeFile = (index) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name.trim()) {
      setError('Repository name is required');
      return;
    }

    // Validate repository name
    const repoNameRegex = /^[a-zA-Z0-9._-]+$/;
    if (!repoNameRegex.test(formData.name)) {
      setError('Repository name can only contain letters, numbers, dots, hyphens, and underscores');
      return;
    }

    setLoading(true);

    try {
      const topicsArray = formData.topics
        ? formData.topics.split(',').map(t => t.trim()).filter(Boolean)
        : [];

      const repoData = {
        name: formData.name,
        description: formData.description,
        isPrivate: formData.isPrivate,
        language: formData.language || (files.length > 0 ? files[0].language : ''),
        topics: topicsArray,
        initializeWithReadme: formData.initializeWithReadme,
        files: files
      };

      const repo = await repoService.createRepo(repoData);
      navigate(`/${user.username}/${repo.name}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create repository');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-semibold text-white mb-2">Create a new repository</h1>
      <p className="text-gray-400 mb-8">
        A repository contains all project files, including the revision history.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-900 bg-opacity-30 border border-red-700 rounded-md text-red-400">
            {error}
          </div>
        )}

        {/* Repository Name */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Repository name <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-2">
            <span className="text-gray-400">{user?.username} /</span>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="awesome-project"
              required
              className="flex-1 px-3 py-2 bg-[#0d1117] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">
            Great repository names are short and memorable.
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Description <span className="text-gray-500">(optional)</span>
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="A brief description of your repository"
            className="w-full px-3 py-2 bg-[#0d1117] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Visibility */}
        <div className="border border-gray-700 rounded-md p-4">
          <p className="text-sm font-semibold text-white mb-4">Visibility</p>
          
          <label className="flex items-start gap-3 p-3 border border-gray-700 rounded-md cursor-pointer hover:border-gray-600 mb-3">
            <input
              type="radio"
              name="isPrivate"
              checked={!formData.isPrivate}
              onChange={() => setFormData({ ...formData, isPrivate: false })}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Globe size={16} className="text-gray-400" />
                <span className="font-semibold text-white">Public</span>
              </div>
              <p className="text-sm text-gray-400">
                Anyone on the internet can see this repository. You choose who can commit.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-3 border border-gray-700 rounded-md cursor-pointer hover:border-gray-600">
            <input
              type="radio"
              name="isPrivate"
              checked={formData.isPrivate}
              onChange={() => setFormData({ ...formData, isPrivate: true })}
              className="mt-1"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Lock size={16} className="text-gray-400" />
                <span className="font-semibold text-white">Private</span>
              </div>
              <p className="text-sm text-gray-400">
                You choose who can see and commit to this repository.
              </p>
            </div>
          </label>
        </div>

        {/* Language */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Primary language <span className="text-gray-500">(optional)</span>
          </label>
          <select
            name="language"
            value={formData.language}
            onChange={handleChange}
            className="w-full px-3 py-2 bg-[#0d1117] border border-gray-700 rounded-md text-white focus:outline-none focus:border-blue-500"
          >
            <option value="">Select a language</option>
            <option value="JavaScript">JavaScript</option>
            <option value="TypeScript">TypeScript</option>
            <option value="Python">Python</option>
            <option value="Java">Java</option>
            <option value="C++">C++</option>
            <option value="C#">C#</option>
            <option value="Go">Go</option>
            <option value="Rust">Rust</option>
            <option value="PHP">PHP</option>
            <option value="Ruby">Ruby</option>
          </select>
        </div>

        {/* Topics */}
        <div>
          <label className="block text-sm font-semibold text-white mb-2">
            Topics <span className="text-gray-500">(optional)</span>
          </label>
          <input
            type="text"
            name="topics"
            value={formData.topics}
            onChange={handleChange}
            placeholder="react, nodejs, api (comma separated)"
            className="w-full px-3 py-2 bg-[#0d1117] border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
          <p className="mt-1 text-xs text-gray-400">
            Add topics to help people find your repository.
          </p>
        </div>

        {/* File Upload */}
        <div className="border border-gray-700 rounded-md p-4">
          <p className="text-sm font-semibold text-white mb-4">Upload files</p>
          
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-700 rounded-md p-8 cursor-pointer hover:border-gray-600 transition-colors">
            <Upload size={48} className="text-gray-500 mb-4" />
            <span className="text-gray-300 mb-2">Click to upload files or drag and drop</span>
            <span className="text-gray-500 text-sm">Support for any file type</span>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              accept="*/*"
            />
          </label>

          {files.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-sm text-gray-400">{files.length} file(s) selected:</p>
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-[#0d1117] border border-gray-700 rounded-md"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <File size={16} className="text-gray-400 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{file.name}</p>
                      <p className="text-gray-500 text-xs">
                        {(file.size / 1024).toFixed(2)} KB • {file.language}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-400 ml-2"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Initialize with README */}
        <div className="border border-gray-700 rounded-md p-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="initializeWithReadme"
              checked={formData.initializeWithReadme}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <div>
              <span className="text-white font-medium">Add a README file</span>
              <p className="text-sm text-gray-400">
                This is where you can write a long description for your project.
              </p>
            </div>
          </label>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-700">
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? 'Creating repository...' : 'Create repository'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateRepo;