import app from './app.js';
import connectDB from './config/db.js';
import logger from './utils/logger.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
dotenv.config();

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create necessary directories if they don't exist
const directories = [
  path.join(__dirname, 'uploads'),
  path.join(__dirname, 'uploads/avatars'),
  path.join(__dirname, 'uploads/repos'),
  path.join(__dirname, '../logs')
];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    logger.info(`Created directory: ${dir}`);
  }
});

// Connect to MongoDB
connectDB();

// Get port from environment
const PORT = process.env.PORT || 5000;

// Start server
const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║        🚀 GitHub Clone Server Started                ║
║                                                       ║
║        Environment: ${process.env.NODE_ENV?.toUpperCase() || 'DEVELOPMENT'.padEnd(11)}                    ║
║        Port: ${PORT}                                     ║
║        URL: http://localhost:${PORT}                    ║
║                                                       ║
║        API Endpoints:                                 ║
║        • Health: http://localhost:${PORT}/health        ║
║        • Auth:   http://localhost:${PORT}/api/auth      ║
║        • Users:  http://localhost:${PORT}/api/users     ║
║        • Repos:  http://localhost:${PORT}/api/repos     ║
║        • Commits: http://localhost:${PORT}/api/commits  ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  logger.error(`Unhandled Rejection at: ${promise}, reason: ${err.message}`);
  console.log(`❌ Error: ${err.message}`);
  
  // Close server & exit process
  server.close(() => {
    logger.error('Server closed due to unhandled rejection');
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  logger.error(`Uncaught Exception: ${err.message}`);
  console.log(`❌ Fatal Error: ${err.message}`);
  console.log('Stack:', err.stack);
  
  // Exit process
  process.exit(1);
});

// Handle SIGTERM signal (graceful shutdown)
process.on('SIGTERM', () => {
  logger.info('SIGTERM signal received: closing HTTP server');
  console.log('👋 SIGTERM signal received: closing HTTP server');
  
  server.close(() => {
    logger.info('HTTP server closed');
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

// Handle SIGINT signal (Ctrl+C)
process.on('SIGINT', () => {
  logger.info('SIGINT signal received: closing HTTP server');
  console.log('\n👋 SIGINT signal received: closing HTTP server');
  
  server.close(() => {
    logger.info('HTTP server closed');
    console.log('✅ HTTP server closed');
    process.exit(0);
  });
});

// Export server for testing purposes
export default server;