import request from 'supertest';
import { app } from '../src/index';
import { getRepository } from 'typeorm';
import { User } from '../src/models/User';

describe('User API - Segurança de Rotas', () => {
  let userId: number;

  // Cria um usuário de teste antes dos testes
  beforeAll(async () => {
    const userRepository = getRepository(User);
    const user = userRepository.create({
      username: 'alice',
      email: 'alice@teste.com',
      password: 'SenhaForte123!',
    });
    const savedUser = await userRepository.save(user);
    userId = savedUser.id;
  });

  // Limpa o banco após os testes
  afterAll(async () => {
    await getRepository(User).delete({});
  });

  // Teste correspondente ao cenário Gherkin
  describe('PUT /user/:id - Atualização de Perfil', () => {
    it('deve falhar com 401 se o usuário não estiver autenticado', async () => {
      const response = await request(app)
        .put(`/user/${userId}`)
        .send({ name: 'Alice Atualizada' });

      expect(response.status).toBe(401); // Ou 403, dependendo da sua implementação
      expect(response.body).toHaveProperty('message');
    });

    it('deve falhar com 403 se o token for de outro usuário', async () => {
      // Simula um token JWT válido, mas de outro usuário (ID 999)
      const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjk5OSwibmFtZSI6ImJvYiJ9.fake';

      const response = await request(app)
        .put(`/user/${userId}`)
        .set('Authorization', `Bearer ${fakeToken}`)
        .send({ name: 'Alice Atualizada' });

      expect(response.status).toBe(403);
      expect(response.body.message).toBe('Acesso negado. Você não tem permissão para editar este perfil.');
    });
  });

  // Teste adicional: rota de seguir sem autenticação
  describe('POST /user/:id/follow', () => {
    it('deve falhar com 401 se não houver token', async () => {
      const response = await request(app)
        .post(`/user/${userId}/follow`)
        .send({ currentUserId: 2 }); // Não confiável – o middleware deve barrar

      expect(response.status).toBe(401);
    });
  });
});