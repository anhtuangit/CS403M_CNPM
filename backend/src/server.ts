import http from 'http';
import app from './app';
import env from './config/env';
import { connectDatabase } from './config/database';
import { ensureAdminSeed } from './services/authService';
import { ensureDefaultPackages } from './services/packageService';

const startServer = async (): Promise<void> => {
  try {
    await connectDatabase();
    await ensureAdminSeed();
    await ensureDefaultPackages();

    const server = http.createServer(app);
    server.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
};

void startServer();

