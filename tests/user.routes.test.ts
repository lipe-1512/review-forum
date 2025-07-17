import request from 'supertest';
import express from 'express';
import userRouter from '../src/api/routes/user.routes';
import UserRepositoryClass from '../src/repository/UserRepository';
import { User } from '../src/models/User';
import { Movie } from '../src/models/Movie';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../src/infra/db'; // Importa a fonte de dados correta
import { UserListItem } from '../src/models/UserListItem';

// Configuração do App Express para os testes
const app = express();
app.use(express.json());
app.use('/users', userRouter);

describe('User API Endpoints - Gherkin Scenarios', () => {
  let server: any;

  // Conecta ao banco de dados e inicia o servidor antes de todos os testes
  beforeAll(async () => {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    server = app.listen(4002);
  });

  // Limpa as tabelas antes de CADA teste para garantir que um teste não interfira no outro
  beforeEach(async () => {
    const userRepository = AppDataSource.getRepository(User);
    const movieRepository = AppDataSource.getRepository(Movie);
    const listItemRepository = AppDataSource.getRepository(UserListItem);

    // Limpa as tabelas em uma ordem que respeita as chaves estrangeiras para evitar erros
    await listItemRepository.query('DELETE FROM "user_list_item";');
    await userRepository.query('DELETE FROM "user_follows";');
    await AppDataSource.getRepository(Movie).query('DELETE FROM "review";'); // Limpa reviews
    await userRepository.query('DELETE FROM "user";');
    await movieRepository.query('DELETE FROM "movie";');
  });

  // Fecha a conexão com o banco e o servidor após a conclusão de todos os testes
  afterAll(async () => {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
    server.close();
  });

  /**
   * Feature: Cadastro de usuário
   */
  describe('1. Feature: Cadastro de usuário', () => {
    it('Scenario: Usuário se cadastra com sucesso', async () => {
      const res = await request(server)
        .post('/users/register')
        .send({
          name: 'Usuário Válido',
          email: 'valido@example.com',
          password: 'Password123'
        });
      
      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.email).toBe('valido@example.com');
    });

    it('Scenario: Falha ao cadastrar por campos inválidos (sem nome)', async () => {
      const res = await request(server)
        .post('/users/register')
        .send({
          email: 'invalido@example.com',
          password: 'password123'
        });
      
      expect(res.statusCode).toEqual(400); 
      expect(res.body.message).toContain('Nome, email e senha são obrigatórios.');
    });
  });

  /**
   * Feature: Atualização de perfil do usuário
   */
  describe('2. Feature: Atualização de perfil do usuário', () => {
    let userToUpdate: User;

    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash('password', 10);
      userToUpdate = await UserRepositoryClass.save(
        UserRepositoryClass.create({ name: 'Original Name', email: 'update@example.com', password: hashedPassword })
      );
    });

    it('Scenario: Usuário atualiza seu perfil com sucesso', async () => {
      const res = await request(server)
        .put('/users/profile')
        .send({ id: userToUpdate.id, name: 'Nome Atualizado' });

      expect(res.statusCode).toEqual(200);
      expect(res.body.name).toBe('Nome Atualizado');
    });
  });

  /**
   * Feature: Exclusão de conta
   */
  describe('3. Feature: Exclusão de conta', () => {
    it('Scenario: Usuário exclui sua conta com sucesso', async () => {
        const hashedPassword = await bcrypt.hash('password', 10);
        const userToDelete = await UserRepositoryClass.save(
            UserRepositoryClass.create({ name: 'User to Delete', email: 'delete@example.com', password: hashedPassword })
        );

        const res = await request(server)
            .delete('/users')
            .send({ id: userToDelete.id });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toBe('Conta excluída com sucesso');

        const foundUser = await UserRepositoryClass.findById(userToDelete.id);
        expect(foundUser).toBeNull();
    });
  });

  /**
   * Features: Seguir e Deixar de Seguir
   */
  describe('4 & 5. Features: Seguir e Deixar de Seguir Usuários', () => {
    let userA: User, userB: User;

    beforeEach(async () => {
      const hashedPassword = await bcrypt.hash('p', 10);
      [userA, userB] = await Promise.all([
        UserRepositoryClass.save(UserRepositoryClass.create({ name: 'User A', email: 'a@example.com', password: hashedPassword })),
        UserRepositoryClass.save(UserRepositoryClass.create({ name: 'User B', email: 'b@example.com', password: hashedPassword }))
      ]);
    });

    it('Scenario: Usuário segue outro usuário com sucesso', async () => {
      const res = await request(server)
        .post(`/users/follow/${userB.id}`)
        .send({ id: userA.id });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toContain(`Seguindo usuário ${userB.id}`);
    });
    
    it('Scenario: Usuário deixa de seguir outro usuário', async () => {
        await UserRepositoryClass.followUser(userA.id, userB.id);

        const res = await request(server)
          .post(`/users/unfollow/${userB.id}`)
          .send({ id: userA.id });
  
        expect(res.statusCode).toEqual(200);
        expect(res.body.message).toContain(`Deixou de seguir usuário ${userB.id}`);
    });
  });
});