process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-secret';

const request = require('supertest');

jest.mock('../models/Admin', () => ({
  findOne: jest.fn(),
  findById: jest.fn(),
}));

const Admin = require('../models/Admin');
const app = require('../app');

describe('Auth integration flow', () => {
  const adminDoc = {
    _id: '507f1f77bcf86cd799439011',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin',
    comparePassword: jest.fn().mockResolvedValue(true),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    Admin.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(adminDoc),
    });
    Admin.findById.mockResolvedValue(adminDoc);
  });

  it('logs in, fetches profile, logs out, and blocks profile after logout', async () => {
    const agent = request.agent(app);

    const login = await agent
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'strong-password' });

    expect(login.statusCode).toBe(200);
    expect(login.body.success).toBe(true);
    expect(login.body.admin.email).toBe('admin@example.com');

    const me = await agent.get('/api/auth/me');
    expect(me.statusCode).toBe(200);
    expect(me.body.admin.email).toBe('admin@example.com');

    const logout = await agent
      .post('/api/auth/logout');
    expect(logout.statusCode).toBe(200);
    expect(logout.body.success).toBe(true);

    const meAfterLogout = await agent.get('/api/auth/me');
    expect(meAfterLogout.statusCode).toBe(401);
  });
});
