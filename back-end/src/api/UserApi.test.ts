import request from 'supertest';
import app, { startServer, closeServer } from '../index';
import { UserService } from '../services/UserService';

describe('User Routes - Follow/Unfollow', () => {
  let server: any;

  beforeAll(async () => {
    server = await startServer(3002);
  });

  afterAll(async () => {
    await closeServer();
  });

  describe('POST /users/follow/:id', () => {
    it('should successfully follow a user', async () => {
      const response = await request(app)
        .post('/users/follow/2')
        .send({ currentUserId: 1 });
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Usuário seguido com sucesso');
    });

    it('should return 400 when trying to follow a user already being followed', async () => {
      // First follow
      await request(app)
        .post('/users/follow/2')
        .send({ currentUserId: 1 });

      // Second attempt
      const response = await request(app)
        .post('/users/follow/2')
        .send({ currentUserId: 1 });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Você já está seguindo este usuário.');
    });

    it('should return 400 when trying to follow yourself', async () => {
      const response = await request(app)
        .post('/users/follow/1')
        .send({ currentUserId: 1 });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Você não pode seguir a si mesmo.');
    });
  });

  describe('POST /users/unfollow/:id', () => {
    it('should successfully unfollow a user', async () => {
      // First follow
      await request(app)
        .post('/users/follow/2')
        .send({ currentUserId: 1 });

      // Then unfollow
      const response = await request(app)
        .post('/users/unfollow/2')
        .send({ currentUserId: 1 });
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Usuário deixou de ser seguido com sucesso');
    });

    it('should return 400 when trying to unfollow a user not being followed', async () => {
      const response = await request(app)
        .post('/users/unfollow/2')
        .send({ currentUserId: 1 });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Você não está seguindo este usuário.');
    });
  });
