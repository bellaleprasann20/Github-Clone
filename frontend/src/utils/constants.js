export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PROFILE: '/profile',
  REPO_DETAILS: '/repo/:username/:reponame',
  CREATE_REPO: '/new',
  NOT_FOUND: '*'
};

export const LANGUAGE_COLORS = {
  JavaScript: '#f1e05a',
  Python: '#3572A5',
  TypeScript: '#2b7489',
  Go: '#00ADD8',
  Java: '#b07219',
  Ruby: '#701516',
  PHP: '#4F5D95',
  C: '#555555',
  'C++': '#f34b7d',
  'C#': '#178600',
  HTML: '#e34c26',
  CSS: '#563d7c'
};