import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, BookOpen } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { repoService } from '../../services/repoService';
import RepoList from '../../components/repo/RepoList';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';

const Home = () => {
  const { user } = useAuth();
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchRepos();
  }, []);

  const fetchRepos = async () => {
    try {
      const data = await repoService.getUserRepos(user.username);
      setRepos(data);
    } catch (error) {
      console.error('Failed to fetch repos:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRepos = repos.filter(repo => {
    if (filter === 'public') return !repo.isPrivate;
    if (filter === 'private') return repo.isPrivate;
    return true;
  });

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-20">
            <Link to="/new">
              <Button variant="primary" size="md" fullWidth>
                <Plus size={16} />
                New
              </Button>
            </Link>

            <nav className="mt-6 space-y-1">
              <button
                onClick={() => setFilter('all')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                  filter === 'all' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800'
                }`}
              >
                All repositories
              </button>
              <button
                onClick={() => setFilter('public')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                  filter === 'public' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800'
                }`}
              >
                Public
              </button>
              <button
                onClick={() => setFilter('private')}
                className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                  filter === 'private' ? 'bg-gray-800 text-white' : 'text-gray-400 hover:bg-gray-800'
                }`}
              >
                Private
              </button>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-semibold text-white">Repositories</h1>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input
                    type="text"
                    placeholder="Find a repository..."
                    className="pl-10 pr-4 py-2 bg-[#0d1117] border border-gray-700 rounded-md text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {loading ? (
            <Loader size="lg" className="py-12" />
          ) : filteredRepos.length === 0 ? (
            <div className="text-center py-16 border border-gray-700 rounded-lg">
              <BookOpen size={48} className="mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {filter === 'all' ? "You don't have any repositories yet" : `No ${filter} repositories`}
              </h3>
              <p className="text-gray-400 mb-4">
                Create a new repository to get started
              </p>
              <Link to="/new">
                <Button variant="primary">
                  <Plus size={16} />
                  Create repository
                </Button>
              </Link>
            </div>
          ) : (
            <RepoList repos={filteredRepos} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;