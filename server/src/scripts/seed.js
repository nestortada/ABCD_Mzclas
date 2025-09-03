import { connectMongo } from '../config/mongo.js';
import { User } from '../models/User.js';
import bcrypt from 'bcryptjs';

async function run() {
  await connectMongo();
  const email = process.env.SEED_EMAIL || 'demo@example.com';
  const password = process.env.SEED_PASSWORD || 'Demo123!';
  const passwordHash = await bcrypt.hash(password, 10);
  await User.deleteOne({ email });
  await User.create({ email, passwordHash });
  console.log(`Seeded user: ${email} / ${password}`);
  process.exit(0);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
