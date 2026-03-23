process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

const request = require('supertest');
const app = require('../app');

describe('Protected projects route', () => {
  it('rejects unauthenticated project creation', async () => {
    const agent = request.agent(app);
    const csrf = await agent.get('/api/auth/csrf-token');

    const response = await agent
      .post('/api/projects')
      .set('X-CSRF-Token', csrf.body.csrfToken)
      .send({
        title: 'Test Project',
        description: 'Test description for auth guard check',
      });

    expect(response.statusCode).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
