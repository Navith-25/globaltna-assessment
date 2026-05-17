const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

// Mock the auth middleware BEFORE requiring routes
jest.mock('../middleware/auth', () => ({
  protect: (req, res, next) => {
    req.user = { id: 'testuser123' };
    next();
  },
}));

const jobRoutes = require('../routes/jobs');
const errorHandler = require('../middleware/errorHandler');

const app = express();
app.use(express.json());
app.use('/api/jobs', jobRoutes);
app.use(errorHandler);

beforeAll(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe('Jobs API', () => {
  let createdJobId;

  test('GET /api/jobs - should return all jobs', async () => {
    const res = await request(app).get('/api/jobs');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('POST /api/jobs - should create a new job', async () => {
    const res = await request(app)
      .post('/api/jobs')
      .send({
        title: 'Test Job',
        description: 'Test description for unit test',
        category: 'Plumbing',
        location: 'Glasgow',
        contactName: 'Test User',
        contactEmail: 'test@example.com',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe('Test Job');
    createdJobId = res.body.data._id;
  });

  test('POST /api/jobs - should fail without required fields', async () => {
    const res = await request(app)
      .post('/api/jobs')
      .send({ category: 'Plumbing' });
    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  test('GET /api/jobs/:id - should return a single job', async () => {
    const res = await request(app).get(`/api/jobs/${createdJobId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data._id).toBe(createdJobId);
  });

  test('GET /api/jobs/:id - should return 404 for invalid id', async () => {
    const res = await request(app).get('/api/jobs/000000000000000000000000');
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  test('PATCH /api/jobs/:id - should update job status', async () => {
    const res = await request(app)
      .patch(`/api/jobs/${createdJobId}`)
      .send({ status: 'In Progress' });
    expect(res.statusCode).toBe(200);
    expect(res.body.data.status).toBe('In Progress');
  });

  test('PATCH /api/jobs/:id - should reject invalid status', async () => {
    const res = await request(app)
      .patch(`/api/jobs/${createdJobId}`)
      .send({ status: 'InvalidStatus' });
    expect(res.statusCode).toBe(400);
  });

  test('DELETE /api/jobs/:id - should delete the job', async () => {
    const res = await request(app).delete(`/api/jobs/${createdJobId}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });
});