import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Plus, Bell, Menu, ChevronDown, Code, GitBranch, Users, BookOpen } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showPlusMenu, setShowPlusMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  
  const userMenuRef = useRef(null);
  const plusMenuRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
      if (plusMenuRef.current && !plusMenuRef.current.contains(event.target)) {
        setShowPlusMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowUserMenu(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setSearchFocused(false);
    }
  };

  return (
    <nav className="bg-[#0d1117] border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-gray-300 hover:text-white"
              onClick={onMenuClick}
            >
              <Menu size={24} />
            </button>
            
            <Link to="/" className="flex items-center">
              <svg height="32" viewBox="0 0 16 16" width="32" className="fill-white">
                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
              </svg>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:block">
              <div className="relative">
                <Search 
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                  size={16} 
                />
                <input
                  type="text"
                  placeholder="Search repositories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setSearchFocused(true)}
                  onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                  className="w-64 bg-[#0d1117] border border-gray-700 rounded-md pl-10 pr-4 py-1.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:w-80 transition-all"
                />
              </div>
            </form>
          </div>

          {/* Center Navigation - Hidden on mobile */}
          <nav className="hidden lg:flex items-center gap-4 text-sm">
            <Link to="/" className="text-gray-300 hover:text-white transition-colors">
              Dashboard
            </Link>
            <Link to="/pulls" className="text-gray-300 hover:text-white transition-colors">
              Pull requests
            </Link>
            <Link to="/issues" className="text-gray-300 hover:text-white transition-colors">
              Issues
            </Link>
            <Link to="/explore" className="text-gray-300 hover:text-white transition-colors">
              Explore
            </Link>
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-3">
            {/* Notifications */}
            <button className="text-gray-300 hover:text-white relative hidden sm:block">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Plus Menu */}
            <div className="relative" ref={plusMenuRef}>
              <button
                onClick={() => setShowPlusMenu(!showPlusMenu)}
                className="text-gray-300 hover:text-white"
              >
                <Plus size={20} />
              </button>

              {showPlusMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-[#161b22] border border-gray-700 rounded-md shadow-lg py-1 z-50">
                  <Link
                    to="/new"
                    onClick={() => setShowPlusMenu(false)}
                    className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <Code size={16} />
                    New repository
                  </Link>
                  <Link
                    to="/new/import"
                    onClick={() => setShowPlusMenu(false)}
                    className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <GitBranch size={16} />
                    Import repository
                  </Link>
                  <div className="border-t border-gray-700 my-1"></div>
                  <Link
                    to="/new/project"
                    onClick={() => setShowPlusMenu(false)}
                    className="flex items-center gap-3 px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
                  >
                    <BookOpen size={16} />
                    New project
                  </Link>
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2"
              >
                <img
                  src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
                  alt={user?.username}
                  className="w-8 h-8 rounded-full border-2 border-gray-700 hover:border-gray-600 transition-colors"
                />
                <ChevronDown size={16} className="text-gray-400 hidden md:block" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-[#161b22] border border-gray-700 rounded-md shadow-lg py-1 z-50">
                  <div className="px-4 py-3 border-b border-gray-700">
                    <p className="text-white font-medium">{user?.username}</p>
                    <p className="text-gray-400 text-sm truncate">{user?.email}</p>
                  </div>
                  
                  <div className="py-1">
                    <Link
                      to={`/${user?.username}`}
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      Your profile
                    </Link>
                    <Link
                      to={`/${user?.username}?tab=repositories`}
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      Your repositories
                    </Link>
                    <Link
                      to="/projects"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      Your projects
                    </Link>
                    <Link
                      to="/stars"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      Your stars
                    </Link>
                  </div>

                  <div className="border-t border-gray-700"></div>

                  <div className="py-1">
                    <Link
                      to="/settings"
                      onClick={() => setShowUserMenu(false)}
                      className="block px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-800 hover:text-white"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search 
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" 
                size={16} 
              />
              <input
                type="text"
                placeholder="Search repositories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0d1117] border border-gray-700 rounded-md pl-10 pr-4 py-1.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
              />
            </div>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;