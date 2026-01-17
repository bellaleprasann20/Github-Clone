import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { RepoProvider } from './context/RepoContext';
import { useAuth } from './hooks/useAuth';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Home from './pages/dashboard/Home';
import CreateRepo from './pages/repo/CreateRepo';
import RepoDetails from './pages/repo/RepoDetails';
import Profile from './pages/profile/Profile';
import NotFound from './pages/NotFound';
import { FullPageLoader } from './components/common/Loader';

const AppContent = () => {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) {
    return <FullPageLoader />;
  }

  return (
    <div className="min-h-screen bg-[#0d1117] flex flex-col">
      {user && <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />}
      
      <div className="flex flex-1">
        {user && <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}
        
        <main className="flex-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={!user ? <Login /> : <Navigate to="/" />} />
            <Route path="/signup" element={!user ? <Signup /> : <Navigate to="/" />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/new" element={<ProtectedRoute><CreateRepo /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/stars" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/explore" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/explore/people" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/pulls" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            <Route path="/issues" element={<ProtectedRoute><Home /></ProtectedRoute>} />
            
            {/* Dynamic Routes */}
            <Route path="/:username/:reponame" element={<ProtectedRoute><RepoDetails /></ProtectedRoute>} />
            <Route path="/:username" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
      
      {user && <Footer />}
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <RepoProvider>
          <AppContent />
        </RepoProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;