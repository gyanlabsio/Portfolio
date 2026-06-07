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

  describe('Change password', () => {
    it('changes password successfully with correct current password', async () => {
      const saveMock = jest.fn().mockResolvedValue(true);
      const adminWithPassword = {
        ...adminDoc,
        password: 'hashed-password',
        comparePassword: jest.fn().mockResolvedValue(true),
        save: saveMock,
      };

      Admin.findById
        .mockResolvedValueOnce(adminDoc) // protect middleware lookup
        .mockReturnValueOnce({ select: jest.fn().mockResolvedValue(adminWithPassword) }); // changePassword lookup

      const agent = request.agent(app);

      // Login first
      await agent
        .post('/api/auth/login')
        .send({ email: 'admin@example.com', password: 'strong-password' });

      const changeRes = await agent
        .put('/api/auth/change-password')
        .send({ currentPassword: 'strong-password', newPassword: 'NewStrongPassword123' });

      expect(changeRes.statusCode).toBe(200);
      expect(changeRes.body.success).toBe(true);
      expect(changeRes.body.message).toBe('Password changed successfully');
      expect(saveMock).toHaveBeenCalled();
    });

    it('rejects change with wrong current password', async () => {
      const adminWithPassword = {
        ...adminDoc,
        password: 'hashed-password',
        comparePassword: jest.fn().mockResolvedValue(false),
      };

      Admin.findById
        .mockResolvedValueOnce(adminDoc) // protect middleware lookup
        .mockReturnValueOnce({ select: jest.fn().mockResolvedValue(adminWithPassword) }); // changePassword lookup

      const agent = request.agent(app);

      await agent
        .post('/api/auth/login')
        .send({ email: 'admin@example.com', password: 'strong-password' });

      const changeRes = await agent
        .put('/api/auth/change-password')
        .send({ currentPassword: 'wrong-password', newPassword: 'NewStrongPassword123' });

      expect(changeRes.statusCode).toBe(401);
      expect(changeRes.body.success).toBe(false);
      expect(changeRes.body.message).toBe('Current password is incorrect');
    });

    it('rejects change when new password is too short', async () => {
      const agent = request.agent(app);

      await agent
        .post('/api/auth/login')
        .send({ email: 'admin@example.com', password: 'strong-password' });

      const changeRes = await agent
        .put('/api/auth/change-password')
        .send({ currentPassword: 'strong-password', newPassword: 'short' });

      expect(changeRes.statusCode).toBe(400);
      expect(changeRes.body.success).toBe(false);
    });

    it('rejects change without authentication', async () => {
      const res = await request(app)
        .put('/api/auth/change-password')
        .send({ currentPassword: 'old', newPassword: 'NewStrongPassword123' });

      expect(res.statusCode).toBe(401);
    });
  });
});
