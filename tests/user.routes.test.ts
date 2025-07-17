import request from 'supertest';
import express from 'express';
import userRouter from '../src/api/routes/user.routes';
import UserRepositoryClass from '../src/repository/UserRepository';
import { User } from '../src/models/User';
import { Movie } from '../src/models/Movie';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../src/infra/db';
import { UserListItem } from '../src/models/UserListItem';
import { ListType } from '../src/models/UserListItem';
import MovieRepository from '../src/repository/MovieRepository';

const app = express();
app.use(express.json());
app.use('/users', userRouter);

describe('User API Endpoints - Gherkin Scenarios', () => {
  let server: any;

  beforeAll(async () => {
    if (!AppDataSource.isInitialized) await AppDataSource.initialize();
    server = app.listen(4002);
  });

  beforeEach(async () => {
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.query('TRUNCATE "user_list_item", "user_follows", "review", "user", "movie" RESTART IDENTITY CASCADE;');
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
      const res = await request(server).post('/users/register').send({
        name: 'Usuário Válido', email: 'valido@example.com', password: 'Password123'
      });
      expect(res.statusCode).toEqual(201);
      expect(res.body.email).toBe('valido@example.com');
    });

    it('Cenário Alternativo: Falha ao cadastrar por campos inválidos', async () => {
      const res = await request(server).post('/users/register').send({
        email: 'invalido@example.com' // Faltando nome e senha
      });
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
      const res = await request(server).put('/users/profile').send({ id: user.id, name: 'Nome Atualizado' });
      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toBe('Nome Atualizado');
    });

    it('Cenário Alternativo: Falha ao atualizar por dados inválidos', async () => {
      const res = await request(server).put('/users/profile').send({ id: 999, name: 'Nome Fantasma' }); // ID não existe
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
        const res = await request(server).delete('/users').send({ id: user.id });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Conta excluída com sucesso');
     });
     // Cenário de cancelamento é uma ação de UI e não é testável aqui.
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
      const res = await request(server).post(`/users/follow/${userB.id}`).send({ id: userA.id });
      expect(res.statusCode).toEqual(200);
    });

    it('Cenário Alternativo: Tenta seguir alguém que já está sendo seguido', async () => {
      await request(server).post(`/users/follow/${userB.id}`).send({ id: userA.id }); // Primeira vez
      const res = await request(server).post(`/users/follow/${userB.id}`).send({ id: userA.id }); // Segunda vez
      expect(res.statusCode).toEqual(200); // Ação deve ser idempotente
    });

    it('Scenario: Usuário deixa de seguir outro usuário', async () => {
        await UserRepositoryClass.followUser(userA.id, userB.id);
        const res = await request(server).post(`/users/unfollow/${userB.id}`).send({ id: userA.id });
        expect(res.statusCode).toEqual(200);
    });

    it('Cenário Alternativo: Tenta deixar de seguir alguém que não segue', async () => {
      const res = await request(server).post(`/users/unfollow/${userB.id}`).send({ id: userA.id });
      expect(res.statusCode).toEqual(400); // Espera-se um erro ou no-op com sucesso. Assumindo erro.
      expect(res.body.message).toContain('Usuário não encontrado ou não está seguindo ninguém.');
    });
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
        const res = await request(server).post(`/users/lists/WANT_TO_WATCH/add`).send({ id: user.id, itemId: movie.id });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toContain('Item adicionado à lista');
    });

    it('Cenário Alternativo: Tenta adicionar item que já está na lista', async () => {
        await UserRepositoryClass.addItemToList(user.id, ListType.WANT_TO_WATCH, Number(movie.id));
        const res = await request(server).post(`/users/lists/WANT_TO_WATCH/add`).send({ id: user.id, itemId: movie.id });
        expect(res.statusCode).toEqual(200); // Ação idempotente
    });

    it('Scenario: Usuário remove item de uma lista', async () => {
        await UserRepositoryClass.addItemToList(user.id, ListType.WANT_TO_WATCH, Number(movie.id));
        const res = await request(server).post(`/users/lists/WANT_TO_WATCH/remove`).send({ id: user.id, itemId: movie.id });
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toContain('Item removido da lista');
    });

    it('Cenário Alternativo: Tenta remover item que não está na lista', async () => {
        const res = await request(server).post(`/users/lists/WANT_TO_WATCH/remove`).send({ id: user.id, itemId: movie.id });
        expect(res.statusCode).toEqual(400);
        expect(res.body.message).toContain('Item não encontrado na lista.');
    });
  });

  /**
   * Feature: 8 & 9. Recuperação e Histórico
   */
  describe('8 & 9. Features: Recuperação de Conta e Histórico', () => {
    it('Scenario: Usuário solicita recuperação de conta', async () => {
      const res = await request(server).post('/users/recover').send({ email: 'recover@example.com' });
      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toContain('Link de recuperação enviado');
    });

    it('Scenario: Usuário visualiza histórico', async () => {
        const res = await request(server).get('/users/history');
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ evaluations: [], posts: [] });
    });
  });
});