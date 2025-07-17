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
