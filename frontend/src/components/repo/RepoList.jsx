import React from 'react';
import RepoCard from './RepoCard';
import Loader from '../common/Loader';

const RepoList = ({ repos, loading }) => {
  if (loading) {
    return <Loader size="lg" className="py-12" />;
  }

  if (!repos || repos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400 text-lg">No repositories found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {repos.map((repo) => (
        <RepoCard key={repo._id} repo={repo} />
      ))}
    </div>
  );
};

export default RepoList;