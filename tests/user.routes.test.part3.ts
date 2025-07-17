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
