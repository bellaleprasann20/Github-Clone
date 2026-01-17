import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { userService } from '../../services/userService';
import { repoService } from '../../services/repoService';
import ProfileCard from '../../components/profile/ProfileCard';
import RepoList from '../../components/repo/RepoList';
import { FullPageLoader } from '../../components/common/Loader';
import { useAuth } from '../../hooks/useAuth';

const Profile = () => {
  const { username } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  // If no username in URL, use current user's username
  const profileUsername = username || currentUser?.username;
  const isOwnProfile = currentUser?.username === profileUsername;

  useEffect(() => {
    if (profileUsername) {
      fetchUserData();
    } else if (currentUser) {
      // Redirect to own profile if no username provided
      navigate(`/${currentUser.username}`);
    }
  }, [profileUsername, currentUser]);

  const fetchUserData = async () => {
    if (!profileUsername) return;

    try {
      const [userData, reposData] = await Promise.all([
        userService.getProfile(profileUsername),
        repoService.getUserRepos(profileUsername)
      ]);
      setUser(userData);
      setRepos(reposData);
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!user) return;
    
    try {
      await userService.followUser(user._id);
      setIsFollowing(true);
      // Update follower count
      setUser(prev => ({
        ...prev,
        followers: [...(prev.followers || []), currentUser._id]
      }));
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  };

  const handleUnfollow = async () => {
    if (!user) return;
    
    try {
      await userService.unfollowUser(user._id);
      setIsFollowing(false);
      // Update follower count
      setUser(prev => ({
        ...prev,
        followers: (prev.followers || []).filter(id => id !== currentUser._id)
      }));
    } catch (error) {
      console.error('Failed to unfollow user:', error);
    }
  };

  if (loading) return <FullPageLoader />;

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-semibold text-white mb-2">User not found</h1>
        <p className="text-gray-400">The user you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <ProfileCard
            user={user}
            isOwnProfile={isOwnProfile}
            isFollowing={isFollowing}
            onFollow={handleFollow}
            onUnfollow={handleUnfollow}
          />
        </div>

        <div className="md:col-span-3">
          <h2 className="text-xl font-semibold text-white mb-4">
            Repositories ({repos.length})
          </h2>
          <RepoList repos={repos} />
        </div>
      </div>
    </div>
  );
};

export default Profile;