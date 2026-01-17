import axiosInstance from '../utils/axiosInstance';

export const repoService = {
  getAllRepos: async () => {
    const response = await axiosInstance.get('/repos');
    return response.data;
  },

  getRepoById: async (id) => {
    const response = await axiosInstance.get(`/repos/${id}`);
    return response.data;
  },

  getUserRepos: async (username) => {
    const response = await axiosInstance.get(`/repos/user/${username}`);
    return response.data;
  },

  createRepo: async (repoData) => {
    const response = await axiosInstance.post('/repos', repoData);
    return response.data;
  },

  updateRepo: async (id, repoData) => {
    const response = await axiosInstance.put(`/repos/${id}`, repoData);
    return response.data;
  },

  deleteRepo: async (id) => {
    const response = await axiosInstance.delete(`/repos/${id}`);
    return response.data;
  },

  starRepo: async (id) => {
    const response = await axiosInstance.post(`/repos/${id}/star`);
    return response.data;
  },

  forkRepo: async (id) => {
    const response = await axiosInstance.post(`/repos/${id}/fork`);
    return response.data;
  },

  // NEW: Search repositories
  searchRepos: async (query, filters = {}) => {
    const response = await axiosInstance.get('/repos/search', {
      params: { q: query, ...filters }
    });
    return response.data;
  }
};