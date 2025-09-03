import http from 'http';
import app from './app.js';
import { connectMongo } from './config/mongo.js';
import { env } from './config/env.js';

async function main() {
  await connectMongo();
  const server = http.createServer(app);
  server.listen(env.port, () => {
    console.log(`API listening on http://localhost:${env.port}`);
  });
}

main().catch((err) => {
  console.error('Fatal startup error', err);
  process.exit(1);
});
