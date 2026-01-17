import React from 'react';
import { MapPin, Link as LinkIcon, Twitter, Building, Users } from 'lucide-react';
import Button from '../common/Button';

const ProfileCard = ({ user, isOwnProfile, onFollow, onUnfollow, isFollowing }) => {
  return (
    <div className="bg-[#0d1117] rounded-lg border border-gray-700">
      <div className="p-6">
        <img
          src={user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username}`}
          alt={user?.username}
          className="w-full aspect-square rounded-full mb-4"
        />
        
        <h1 className="text-2xl font-semibold text-white mb-1">{user?.username}</h1>
        
        {user?.bio && (
          <p className="text-gray-300 mb-4">{user.bio}</p>
        )}

        {!isOwnProfile && (
          <Button
            variant={isFollowing ? 'outline' : 'primary'}
            fullWidth
            onClick={isFollowing ? onUnfollow : onFollow}
            className="mb-4"
          >
            {isFollowing ? 'Unfollow' : 'Follow'}
          </Button>
        )}

        <div className="space-y-2 text-sm text-gray-400">
          {user?.company && (
            <div className="flex items-center gap-2">
              <Building size={16} />
              <span>{user.company}</span>
            </div>
          )}
          {user?.location && (
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span>{user.location}</span>
            </div>
          )}
          {user?.website && (
            <div className="flex items-center gap-2">
              <LinkIcon size={16} />
              <a href={user.website} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                {user.website}
              </a>
            </div>
          )}
          {user?.twitter && (
            <div className="flex items-center gap-2">
              <Twitter size={16} />
              <a href={`https://twitter.com/${user.twitter}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                {user.twitter}
              </a>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-700 text-sm">
          <div className="flex items-center gap-1">
            <Users size={16} className="text-gray-400" />
            <span className="text-white font-semibold">{user?.followers || 0}</span>
            <span className="text-gray-400">followers</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-white font-semibold">{user?.following || 0}</span>
            <span className="text-gray-400">following</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;