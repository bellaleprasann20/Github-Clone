import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#0d1117] border-t border-gray-800 mt-auto">
      <div className="max-w-[1280px] mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <div>
            <h3 className="text-gray-400 font-semibold mb-3 text-sm">Product</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-blue-400 hover:text-blue-300 text-sm">Features</Link></li>
              <li><Link to="/" className="text-blue-400 hover:text-blue-300 text-sm">Security</Link></li>
              <li><Link to="/" className="text-blue-400 hover:text-blue-300 text-sm">Team</Link></li>
              <li><Link to="/" className="text-blue-400 hover:text-blue-300 text-sm">Enterprise</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-gray-400 font-semibold mb-3 text-sm">Platform</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-blue-400 hover:text-blue-300 text-sm">Developer API</Link></li>
              <li><Link to="/" className="text-blue-400 hover:text-blue-300 text-sm">Partners</Link></li>
              <li><Link to="/" className="text-blue-400 hover:text-blue-300 text-sm">Atom</Link></li>
              <li><Link to="/" className="text-blue-400 hover:text-blue-300 text-sm">Electron</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-gray-400 font-semibold mb-3 text-sm">Support</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-blue-400 hover:text-blue-300 text-sm">Docs</Link></li>
              <li><Link to="/" className="text-blue-400 hover:text-blue-300 text-sm">Community Forum</Link></li>
              <li><Link to="/" className="text-blue-400 hover:text-blue-300 text-sm">Training</Link></li>
              <li><Link to="/" className="text-blue-400 hover:text-blue-300 text-sm">Status</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-gray-400 font-semibold mb-3 text-sm">Company</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-blue-400 hover:text-blue-300 text-sm">About</Link></li>
              <li><Link to="/" className="text-blue-400 hover:text-blue-300 text-sm">Blog</Link></li>
              <li><Link to="/" className="text-blue-400 hover:text-blue-300 text-sm">Careers</Link></li>
              <li><Link to="/" className="text-blue-400 hover:text-blue-300 text-sm">Press</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">© 2025 GitHub Clone. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="/" className="text-blue-400 hover:text-blue-300 text-sm">Terms</Link>
            <Link to="/" className="text-blue-400 hover:text-blue-300 text-sm">Privacy</Link>
            <Link to="/" className="text-blue-400 hover:text-blue-300 text-sm">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;