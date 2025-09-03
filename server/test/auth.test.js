import { describe, it, beforeAll, afterAll, expect, vi } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../src/app.js';
import { User } from '../src/models/User.js';
import * as tokenUtil from '../src/utils/token.js';

let mongo: MongoMemoryServer;

describe('Auth + Password reset flow', () => {
  beforeAll(async () => {
    mongo = await MongoMemoryServer.create();
    const uri = mongo.getUri();
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongo.stop();
  });

  it('registers and logs in', async () => {
    const email = 'test@example.com';
    const password = 'StrongPass123!';

    await request(app).post('/api/auth/register').send({ email, password }).expect(201);
    const res = await request(app).post('/api/auth/login').send({ email, password }).expect(200);
    expect(res.body.accessToken).toBeDefined();
  });

  it('requests reset and sets hashed token + exp', async () => {
    const email = 'reset@example.com';
    const password = 'Demo123!';
    await request(app).post('/api/auth/register').send({ email, password }).expect(201);

    // Stub token generator to be deterministic
    vi.spyOn(tokenUtil, 'generateResetToken').mockReturnValue('fixedtokenvalue1234567890');

    await request(app).post('/api/auth/request-reset').send({ email }).expect(200);
    const user = await User.findOne({ email }).lean();
    expect(user?.resetTokenHash).toBeTruthy();
    expect(user?.resetTokenExp).toBeTruthy();
  });

  it('resets password with valid token', async () => {
    const email = 'final@example.com';
    const password = 'OldPass123!';
    await request(app).post('/api/auth/register').send({ email, password }).expect(201);

    // Prepare token directly
    const token = 'resettokenvalueABCDE';
    const { sha256Hex } = await import('../src/utils/hash.js');
    const user = await User.findOne({ email });
    user!.resetTokenHash = sha256Hex(token);
    user!.resetTokenExp = new Date(Date.now() + 5 * 60 * 1000);
    await user!.save();

    await request(app).post('/api/auth/reset').send({ email, token, newPassword: 'NewPass123!' }).expect(200);

    // Should allow login with new password
    await request(app).post('/api/auth/login').send({ email, password: 'NewPass123!' }).expect(200);
  });
});
