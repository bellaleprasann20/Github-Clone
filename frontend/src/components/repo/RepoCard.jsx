import React from 'react';
import { Link } from 'react-router-dom';
import { Star, GitFork, Lock, Globe, Circle } from 'lucide-react';
import { LANGUAGE_COLORS } from '../../utils/constants';

const RepoCard = ({ repo }) => {
  // Get owner username - handle both populated and non-populated cases
  const ownerUsername = typeof repo.owner === 'object' ? repo.owner.username : repo.owner;
  
  return (
    <div className="border border-gray-700 rounded-md p-4 hover:border-gray-600 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {repo.isPrivate ? (
              <Lock size={16} className="text-gray-400" />
            ) : (
              <Globe size={16} className="text-gray-400" />
            )}
            <Link
              to={`/${ownerUsername}/${repo.name}`}
              className="text-blue-400 hover:underline font-semibold text-lg"
            >
              {repo.name}
            </Link>
            <span className="text-xs px-2 py-0.5 border border-gray-600 rounded-full text-gray-400">
              {repo.isPrivate ? 'Private' : 'Public'}
            </span>
          </div>

          {repo.description && (
            <p className="text-gray-400 text-sm mb-3">{repo.description}</p>
          )}

          {repo.topics && repo.topics.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {repo.topics.map((topic) => (
                <span
                  key={topic}
                  className="text-xs px-2 py-1 bg-blue-900 bg-opacity-30 text-blue-400 rounded-full hover:bg-opacity-50 cursor-pointer"
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
            <span className="text-xs">Updated {repo.updatedAt}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepoCard;