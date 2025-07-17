import request from 'supertest';
import app from '../src/index';
import { AppDataSource } from '../src/infra/db';
import { User } from '../src/models/User';
import { Movie } from '../src/models/Movie';
import { ListType } from '../src/models/UserListItem';
import MovieRepository from '../src/repository/MovieRepository';
import UserRepositoryClass from '../src/repository/UserRepository';

describe('User API Endpoints - All Scenarios', () => {
  let server: any;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    server = app.listen(4003);
  });

  beforeEach(async () => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.query('TRUNCATE "user_list_item", "user_follows", "review", "comment", "forum", "user", "movie" RESTART IDENTITY CASCADE;');
    await queryRunner.release();
  });

  afterAll(async () => {
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
    server.close();
  });

  /**
   * Feature: 1. Cadastro de usuário
   */
  describe('1. Feature: Cadastro de usuário', () => {
    it('Scenario: Usuário se cadastra com sucesso', async () => {
      const res = await request(server).post('/api/users/register').send({
        name: 'Usuário Válido', email: 'valido@example.com', password: 'Password123'
      });
      expect(res.statusCode).toEqual(201);
      expect(res.body.email).toBe('valido@example.com');
    });

    it('Cenário Alternativo: Falha ao cadastrar por campos inválidos', async () => {
      const res = await request(server).post('/api/users/register').send({ email: 'invalido@example.com' });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('Nome, email e senha são obrigatórios.');
    });
  });

  /**
   * Feature: 2. Atualização de perfil do usuário
   */
  describe('2. Feature: Atualização de perfil do usuário', () => {
    let user: User;
    beforeEach(async () => {
      user = await UserRepositoryClass.save(UserRepositoryClass.create({ name: 'Original', email: 'update@example.com', password: 'p' }));
    });

    it('Scenario: Usuário atualiza seu perfil com sucesso', async () => {
      const res = await request(server).put('/api/users/profile').send({ id: user.id, name: 'Nome Atualizado' });
      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toBe('Nome Atualizado');
    });

    it('Cenário Alternativo: Falha ao atualizar usuário inexistente', async () => {
      const res = await request(server).put('/api/users/profile').send({ id: 999, name: 'Nome Fantasma' });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('Usuário não encontrado.');
    });
  });

  /**
   * Feature: 3. Exclusão de conta
   */
  describe('3. Feature: Exclusão de conta', () => {
     it('Scenario: Usuário exclui sua conta com sucesso', async () => {
        const user = await UserRepositoryClass.save(UserRepositoryClass.create({ name: 'ToDelete', email: 'delete@example.com', password: 'p' }));
        const res = await request(server).delete('/api/users').send({ id: user.id });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Conta excluída com sucesso');
     });
  });

  /**
   * Feature: 4 & 5. Seguir e Deixar de Seguir
   */
  describe('4 & 5. Features: Seguir e Deixar de Seguir Usuários', () => {
    let userA: User, userB: User;
    beforeEach(async () => {
      [userA, userB] = await Promise.all([
        UserRepositoryClass.save(UserRepositoryClass.create({ name: 'User A', email: 'a@example.com', password: 'p' })),
        UserRepositoryClass.save(UserRepositoryClass.create({ name: 'User B', email: 'b@example.com', password: 'p' }))
      ]);
    });

    it('Scenario: Usuário segue outro usuário com sucesso', async () => {
      const res = await request(server).post(`/api/users/follow/${userB.id}`).send({ id: userA.id });
      expect(res.statusCode).toEqual(200);
    });

    it('Cenário Alternativo: Tenta seguir alguém que já está sendo seguido', async () => {
      await request(server).post(`/api/users/follow/${userB.id}`).send({ id: userA.id });
      const res = await request(server).post(`/api/users/follow/${userB.id}`).send({ id: userA.id });
      expect(res.statusCode).toEqual(200);
    });

    it('Scenario: Usuário deixa de seguir outro usuário', async () => {
        await UserRepositoryClass.followUser(userA.id, userB.id);
        const res = await request(server).post(`/api/users/unfollow/${userB.id}`).send({ id: userA.id });
        expect(res.statusCode).toEqual(200);
    });

    // --- TESTE CORRIGIDO ---
    it('Cenário Alternativo: Tenta deixar de seguir alguém que não segue', async () => {
      const res = await request(server).post(`/api/users/unfollow/${userB.id}`).send({ id: userA.id });
      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toContain('Não é possível deixar de seguir um usuário que não está sendo seguido.');
    });
    // --- FIM DA CORREÇÃO ---
  });

  /**
   * Feature: 6 & 7. Listas de entretenimento
   */
  describe('6 & 7. Features: Adicionar e Remover Itens de Listas', () => {
    let user: User, movie: Movie;
    beforeEach(async () => {
        user = await UserRepositoryClass.save(UserRepositoryClass.create({ name: 'ListUser', email: 'list@example.com', password: 'p' }));
        movie = await MovieRepository.saveMovie(new Movie('Inception', 'A thriller'));
    });

    it('Scenario: Usuário adiciona um filme à lista', async () => {
        const res = await request(server).post(`/api/users/lists/WANT_TO_WATCH/add`).send({ id: user.id, itemId: Number(movie.id) });
        expect(res.statusCode).toEqual(200);
    });

    it('Cenário Alternativo: Tenta adicionar item que já está na lista', async () => {
        await UserRepositoryClass.addItemToList(user.id, 'WANT_TO_WATCH', Number(movie.id));
        const res = await request(server).post(`/api/users/lists/WANT_TO_WATCH/add`).send({ id: user.id, itemId: Number(movie.id) });
        expect(res.statusCode).toEqual(200);
    });

    it('Scenario: Usuário remove item de uma lista', async () => {
        await UserRepositoryClass.addItemToList(user.id, 'WANT_TO_WATCH', Number(movie.id));
        const res = await request(server).post(`/api/users/lists/WANT_TO_WATCH/remove`).send({ id: user.id, itemId: Number(movie.id) });
        expect(res.statusCode).toEqual(200);
    });

    it('Cenário Alternativo: Tenta remover item que não está na lista', async () => {
        const res = await request(server).post(`/api/users/lists/WANT_TO_WATCH/remove`).send({ id: user.id, itemId: Number(movie.id) });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toContain('Item não encontrado na lista.');
    });
  });

  /**
   * Feature: 8 & 9. Recuperação e Histórico
   */
  describe('8 & 9. Features: Recuperação de Conta e Histórico', () => {
    it('Scenario: Usuário solicita recuperação de conta', async () => {
      const res = await request(server).post('/api/users/recover').send({ email: 'recover@example.com' });
      expect(res.statusCode).toEqual(200);
    });

    it('Scenario: Usuário visualiza histórico', async () => {
        const res = await request(server).get('/api/users/history');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ evaluations: [], posts: [] });
    });
  });
});