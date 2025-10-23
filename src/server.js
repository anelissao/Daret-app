import { config } from './shared/config/index.js';
import { connectMongo } from './shared/database/mongoose.js';
import { createApp } from './app.js';

const start = async () => {
  try {
    await connectMongo(config.mongoUri);
    const app = createApp();
    const server = app.listen(config.port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running on http://localhost:${config.port}`);
    });

    const shutdown = (signal) => {
      // eslint-disable-next-line no-console
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(() => process.exit(0));
      setTimeout(() => process.exit(1), 10000).unref();
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

start();
