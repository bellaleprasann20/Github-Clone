import React, { createContext, useState } from 'react';
import { repoService } from '../services/repoService';

export const RepoContext = createContext();

export const RepoProvider = ({ children }) => {
  const [repos, setRepos] = useState([]);
  const [currentRepo, setCurrentRepo] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchRepos = async () => {
    setLoading(true);
    try {
      const data = await repoService.getAllRepos();
      setRepos(data);
    } catch (error) {
      console.error('Failed to fetch repos:', error);
    } finally {
      setLoading(false);
    }
  };

  const createRepo = async (repoData) => {
    const newRepo = await repoService.createRepo(repoData);
    setRepos([newRepo, ...repos]);
    return newRepo;
  };

  const updateRepo = async (id, repoData) => {
    const updatedRepo = await repoService.updateRepo(id, repoData);
    setRepos(repos.map(repo => repo._id === id ? updatedRepo : repo));
    return updatedRepo;
  };

  const deleteRepo = async (id) => {
    await repoService.deleteRepo(id);
    setRepos(repos.filter(repo => repo._id !== id));
  };

  return (
    <RepoContext.Provider value={{
      repos,
      currentRepo,
      loading,
      fetchRepos,
      createRepo,
      updateRepo,
      deleteRepo,
      setCurrentRepo
    }}>
      {children}
    </RepoContext.Provider>
  );
};