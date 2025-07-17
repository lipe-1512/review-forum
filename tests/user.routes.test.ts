import request from 'supertest';
import express from 'express';
import userRouter from '../src/api/routes/user.routes';
import UserRepositoryClass from '../src/repository/UserRepository';
import bcrypt from 'bcryptjs';

const app = express();
app.use(express.json());
app.use('/users', userRouter);

describe('User Routes', () => {
  let server: any;

  beforeAll((done) => {
    server = app.listen(4000, done);
  });

  afterAll((done) => {
    server.close(done);
  });

  describe('POST /users/register', () => {
    it('should register a new user successfully', async () => {
      const res = await request(server)
        .post('/users/register')
        .send({
          name: 'Test User',
          email: 'testuser@example.com',
          password: 'StrongPass123'
        });
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.email).toBe('testuser@example.com');
    });

    it('should fail to register with missing fields', async () => {
      const res = await request(server)
        .post('/users/register')
        .send({
          email: 'testuser2@example.com'
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message');
    });

    it('should fail to register with duplicate email', async () => {
      // First registration
      await request(server)
        .post('/users/register')
        .send({
          name: 'Test User',
          email: 'duplicate@example.com',
          password: 'StrongPass123'
        });
      // Second registration with same email
      const res = await request(server)
        .post('/users/register')
        .send({
          name: 'Test User 2',
          email: 'duplicate@example.com',
          password: 'StrongPass123'
        });
      expect(res.statusCode).toEqual(400);
      expect(res.body).toHaveProperty('message');
    });
  });

  describe('POST /users/login', () => {
    const email = 'loginuser@example.com';
    const password = 'LoginPass123';

    beforeAll(async () => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = UserRepositoryClass.create({ name: 'Login User', email, password: hashedPassword });
      await UserRepositoryClass.save(user);
    });

    it('should login successfully with correct credentials', async () => {
      const res = await request(server)
        .post('/users/login')
        .send({ email, password });
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should fail login with incorrect password', async () => {
      const res = await request(server)
        .post('/users/login')
        .send({ email, password: 'WrongPass' });
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message');
    });

    it('should fail login with non-existent email', async () => {
      const res = await request(server)
        .post('/users/login')
        .send({ email: 'nonexistent@example.com', password: 'AnyPass' });
      expect(res.statusCode).toEqual(401);
      expect(res.body).toHaveProperty('message');
    });
  });

  // Additional tests for update, delete, follow, unfollow, list management, recover, history can be added similarly
});