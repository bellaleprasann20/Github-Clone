import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search as SearchIcon, Code, Users, Star, GitFork, Circle } from 'lucide-react';
import { repoService } from '../services/repoService';
import { userService } from '../services/userService';
import Loader from '../components/common/Loader';
import { LANGUAGE_COLORS } from '../utils/constants';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  
  const [activeTab, setActiveTab] = useState('repositories');
  const [repositories, setRepositories] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    language: '',
    sort: 'best-match'
  });

  useEffect(() => {
    if (query) {
      performSearch();
    }
  }, [query, activeTab, filters]);

  const performSearch = async () => {
    setLoading(true);
    try {
      if (activeTab === 'repositories') {
        const results = await repoService.searchRepos(query, filters);
        setRepositories(results);
      } else if (activeTab === 'users') {
        const results = await userService.searchUsers(query);
        setUsers(results);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRepos = repositories.filter(repo => {
    if (filters.language && repo.language !== filters.language) {
      return false;
    }
    return true;
  });

  const sortedRepos = [...filteredRepos].sort((a, b) => {
    switch (filters.sort) {
      case 'stars':
        return (b.stars?.length || 0) - (a.stars?.length || 0);
      case 'forks':
        return (b.forks?.length || 0) - (a.forks?.length || 0);
      case 'updated':
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      default:
        return 0;
    }
  });

  const languages = [...new Set(repositories.map(r => r.language).filter(Boolean))];

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-6">
      {/* Search Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white mb-2">
          {repositories.length + users.length} results for "{query}"
        </h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700 mb-6">
        <nav className="flex gap-4">
          <button
            onClick={() => setActiveTab('repositories')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'repositories'
                ? 'border-orange-500 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Code size={16} />
              <span>Repositories</span>
              {repositories.length > 0 && (
                <span className="px-2 py-0.5 bg-gray-700 rounded-full text-xs">
                  {repositories.length}
                </span>
              )}
            </div>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 border-b-2 transition-colors ${
              activeTab === 'users'
                ? 'border-orange-500 text-white'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users size={16} />
              <span>Users</span>
              {users.length > 0 && (
                <span className="px-2 py-0.5 bg-gray-700 rounded-full text-xs">
                  {users.length}
                </span>
              )}
            </div>
          </button>
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Filters Sidebar */}
        {activeTab === 'repositories' && (
          <div className="lg:col-span-1">
            <div className="bg-[#0d1117] border border-gray-700 rounded-md p-4 sticky top-20">
              <h3 className="text-white font-semibold mb-4">Filters</h3>

              {/* Language Filter */}
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">Language</label>
                <select
                  value={filters.language}
                  onChange={(e) => setFilters({ ...filters, language: e.target.value })}
                  className="w-full bg-[#0d1117] border border-gray-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="">All languages</option>
                  {languages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort Filter */}
              <div className="mb-4">
                <label className="block text-gray-400 text-sm mb-2">Sort by</label>
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                  className="w-full bg-[#0d1117] border border-gray-700 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-500"
                >
                  <option value="best-match">Best match</option>
                  <option value="stars">Most stars</option>
                  <option value="forks">Most forks</option>
                  <option value="updated">Recently updated</option>
                </select>
              </div>

              {/* Clear Filters */}
              {(filters.language || filters.sort !== 'best-match') && (
                <button
                  onClick={() => setFilters({ language: '', sort: 'best-match' })}
                  className="w-full px-3 py-2 text-sm text-blue-400 hover:text-blue-300 border border-gray-700 rounded-md hover:border-gray-600"
                >
                  Clear filters
                </button>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        <div className={activeTab === 'repositories' ? 'lg:col-span-3' : 'lg:col-span-4'}>
          {loading ? (
            <Loader size="lg" className="py-12" />
          ) : (
            <>
              {/* Repository Results */}
              {activeTab === 'repositories' && (
                <div className="space-y-4">
                  {sortedRepos.length > 0 ? (
                    sortedRepos.map((repo) => {
                      const ownerUsername = typeof repo.owner === 'object' ? repo.owner.username : repo.owner;
                      
                      return (
                        <div
                          key={repo._id}
                          className="border border-gray-700 rounded-md p-4 hover:border-gray-600 transition-colors"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <Link
                                to={`/${ownerUsername}/${repo.name}`}
                                className="text-blue-400 hover:underline font-semibold text-lg"
                              >
                                {ownerUsername}/{repo.name}
                              </Link>
                              {repo.isPrivate && (
                                <span className="ml-2 text-xs px-2 py-0.5 border border-gray-600 rounded-full text-gray-400">
                                  Private
                                </span>
                              )}
                            </div>
                          </div>

                          {repo.description && (
                            <p className="text-gray-400 text-sm mb-3">{repo.description}</p>
                          )}

                          {repo.topics && repo.topics.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {repo.topics.map((topic) => (
                                <span
                                  key={topic}
                                  className="text-xs px-2 py-1 bg-blue-900 bg-opacity-30 text-blue-400 rounded-full"
                                >
                                  {topic}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            {repo.language && (
                              <div className="flex items-center gap-1">
                                <Circle
                                  size={12}
                                  fill={LANGUAGE_COLORS[repo.language] || '#888'}
                                  color={LANGUAGE_COLORS[repo.language] || '#888'}
                                />
                                <span>{repo.language}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Star size={16} />
                              <span>{repo.stars?.length || 0}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <GitFork size={16} />
                              <span>{repo.forks?.length || 0}</span>
                            </div>
                            <span className="text-xs">
                              Updated {new Date(repo.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-12">
                      <SearchIcon size={48} className="mx-auto text-gray-600 mb-4" />
                      <p className="text-gray-400 text-lg mb-2">
                        No repositories found for "{query}"
                      </p>
                      <p className="text-gray-500 text-sm">
                        Try different keywords or remove filters
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* User Results */}
              {activeTab === 'users' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <Link
                        key={user._id}
                        to={`/${user.username}`}
                        className="border border-gray-700 rounded-md p-4 hover:border-gray-600 transition-colors"
                      >
                        <div className="flex items-center gap-3 mb-3">
                          <img
                            src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                            alt={user.username}
                            className="w-16 h-16 rounded-full"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white font-semibold truncate">{user.username}</h3>
                            {user.bio && (
                              <p className="text-gray-400 text-sm truncate">{user.bio}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          <span>{user.followers?.length || 0} followers</span>
                          <span>·</span>
                          <span>{user.following?.length || 0} following</span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <Users size={48} className="mx-auto text-gray-600 mb-4" />
                      <p className="text-gray-400 text-lg mb-2">
                        No users found for "{query}"
                      </p>
                      <p className="text-gray-500 text-sm">
                        Try different keywords
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;