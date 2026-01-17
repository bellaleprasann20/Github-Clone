import axiosInstance from '../utils/axiosInstance';

export const userService = {
  getProfile: async (username) => {
    const response = await axiosInstance.get(`/users/${username}`);
    return response.data;
  },

  updateProfile: async (userData) => {
    const response = await axiosInstance.put('/users/profile', userData);
    return response.data;
  },

  followUser: async (userId) => {
    const response = await axiosInstance.post(`/users/${userId}/follow`);
    return response.data;
  },

  unfollowUser: async (userId) => {
    const response = await axiosInstance.delete(`/users/${userId}/follow`);
    return response.data;
  },

  getFollowers: async (username) => {
    const response = await axiosInstance.get(`/users/${username}/followers`);
    return response.data;
  },

  getFollowing: async (username) => {
    const response = await axiosInstance.get(`/users/${username}/following`);
    return response.data;
  },

  // NEW: Search users
  searchUsers: async (query) => {
    const response = await axiosInstance.get('/users/search', {
      params: { q: query }
    });
    return response.data;
  }
};