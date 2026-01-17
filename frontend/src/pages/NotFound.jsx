import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/common/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-2xl text-gray-400 mb-8">Page not found</p>
        <Link to="/">
          <Button variant="primary">Go back home</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;