import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, GitFork, Eye, Code, BookOpen, GitBranch, Lock, Globe, FileText } from 'lucide-react';
import { repoService } from '../../services/repoService';
import Button from '../../components/common/Button';
import { FullPageLoader } from '../../components/common/Loader';
import { useAuth } from '../../hooks/useAuth';
import CodeViewer from '../../components/repo/CodeViewer';
import FileExplorer from '../../components/repo/FileExplorer';

const RepoDetails = () => {
  const { username, reponame } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isStarred, setIsStarred] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (username && reponame) {
      fetchRepo();
    }
  }, [username, reponame]);

  const fetchRepo = async () => {
    try {
      const repos = await repoService.getUserRepos(username);
      const foundRepo = repos.find(r => r.name === reponame);
      
      if (foundRepo) {
        setRepo(foundRepo);
        if (user && foundRepo.stars) {
          setIsStarred(foundRepo.stars.includes(user._id));
        }
        // Auto-select first file if available
        if (foundRepo.files && foundRepo.files.length > 0) {
          setSelectedFile(foundRepo.files[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch repo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStar = async () => {
    if (!repo || !user) return;
    
    try {
      await repoService.starRepo(repo._id);
      setIsStarred(!isStarred);
      setRepo({
        ...repo,
        stars: isStarred 
          ? repo.stars.filter(id => id !== user._id)
          : [...repo.stars, user._id]
      });
    } catch (error) {
      console.error('Failed to star repo:', error);
    }
  };

  const handleFork = async () => {
    if (!repo) return;
    
    try {
      const forkedRepo = await repoService.forkRepo(repo._id);
      navigate(`/${user.username}/${forkedRepo.name}`);
    } catch (error) {
      console.error('Failed to fork repo:', error);
      alert(error.response?.data?.message || 'Failed to fork repository');
    }
  };

  if (loading) return <FullPageLoader />;

  if (!repo) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold text-white mb-2">Repository not found</h1>
        <p className="text-gray-400">The repository you're looking for doesn't exist.</p>
      </div>
    );
  }

  const ownerUsername = typeof repo.owner === 'object' ? repo.owner.username : username;

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-6">
      {/* Repository Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Link to={`/${ownerUsername}`} className="text-blue-400 hover:underline text-xl">
            {ownerUsername}
          </Link>
          <span className="text-gray-500 text-xl">/</span>
          <h1 className="text-blue-400 font-semibold text-xl">{repo.name}</h1>
          <span className="text-xs px-2 py-0.5 border border-gray-600 rounded-full text-gray-400">
            {repo.isPrivate ? (
              <>
                <Lock size={12} className="inline mr-1" />
                Private
              </>
            ) : (
              <>
                <Globe size={12} className="inline mr-1" />
                Public
              </>
            )}
          </span>
        </div>

        {repo.description && (
          <p className="text-gray-300 mb-4">{repo.description}</p>
        )}

        {/* Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant={isStarred ? 'secondary' : 'outline'}
            size="sm"
            onClick={handleStar}
          >
            <Star size={16} fill={isStarred ? 'currentColor' : 'none'} />
            {isStarred ? 'Starred' : 'Star'}
            <span className="ml-1">{repo.stars?.length || 0}</span>
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleFork}>
            <GitFork size={16} />
            Fork
            <span className="ml-1">{repo.forks?.length || 0}</span>
          </Button>

          <Button variant="outline" size="sm">
            <Eye size={16} />
            Watch
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-700 mb-6">
        <nav className="flex gap-4">
          <button className="px-4 py-2 border-b-2 border-orange-500 text-white font-medium flex items-center gap-2">
            <Code size={16} />
            Code
          </button>
          <button className="px-4 py-2 text-gray-400 hover:text-white flex items-center gap-2">
            <GitBranch size={16} />
            Issues
          </button>
          <button className="px-4 py-2 text-gray-400 hover:text-white flex items-center gap-2">
            <BookOpen size={16} />
            Pull requests
          </button>
        </nav>
      </div>

      {/* Repository Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <div className="bg-[#161b22] border border-gray-700 rounded-md mb-6">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitBranch size={16} className="text-gray-400" />
                  <button className="text-white font-medium hover:text-blue-400">
                    {repo.defaultBranch || 'main'}
                  </button>
                </div>
                <span className="text-gray-400 text-sm">
                  {repo.files?.length || 0} files
                </span>
              </div>
            </div>

            {/* File Explorer and Content */}
            {repo.files && repo.files.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
                <div className="md:col-span-1">
                  <FileExplorer
                    files={repo.files}
                    onFileSelect={setSelectedFile}
                    selectedFile={selectedFile}
                  />
                </div>
                <div className="md:col-span-3">
                  {selectedFile ? (
                    <CodeViewer file={selectedFile} />
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <FileText size={48} className="mx-auto mb-4 text-gray-600" />
                      <p>Select a file to view its contents</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-400">
                <BookOpen size={48} className="mx-auto mb-4 text-gray-600" />
                <p>No files in this repository yet</p>
              </div>
            )}
          </div>

          {/* README */}
          {repo.hasReadme && (
            <div className="bg-[#161b22] border border-gray-700 rounded-md p-6">
              <div className="flex items-center gap-2 mb-4">
                <BookOpen size={20} className="text-gray-400" />
                <h2 className="text-xl font-semibold text-white">README.md</h2>
              </div>
              <div className="prose prose-invert max-w-none">
                <p className="text-gray-300">
                  {repo.description || `# ${repo.name}\n\nThis is the README file for ${repo.name}.`}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-[#161b22] border border-gray-700 rounded-md p-4 sticky top-20">
            <h3 className="text-white font-semibold mb-3">About</h3>
            <p className="text-gray-400 text-sm mb-4">
              {repo.description || 'No description available'}
            </p>

            {repo.topics && repo.topics.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {repo.topics.map((topic) => (
                    <span
                      key={topic}
                      className="text-xs px-2 py-1 bg-blue-900 bg-opacity-30 text-blue-400 rounded-full hover:bg-opacity-50 cursor-pointer"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {repo.language && (
              <div className="mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-400">Language:</span>
                  <span className="text-white font-medium">{repo.language}</span>
                </div>
              </div>
            )}

            <div className="space-y-2 text-sm border-t border-gray-700 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Stars</span>
                <span className="text-white font-semibold">{repo.stars?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Watching</span>
                <span className="text-white font-semibold">{repo.watchers?.length || 0}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Forks</span>
                <span className="text-white font-semibold">{repo.forks?.length || 0}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepoDetails;