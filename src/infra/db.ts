import { DataSource } from 'typeorm';
import { User } from '../models/User';
import { Movie } from '../models/Movie';
import { UserListItem } from '../models/UserListItem';
import { Review } from '../models/Review';

// ATENÇÃO: Altere as credenciais abaixo para as do seu banco de dados PostgreSQL
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres', // Seu usuário
  password: '123',      // Sua senha
  database: 'review_forum_db', // Nome do seu banco de dados
  synchronize: true, // true em dev para criar tabelas automaticamente
  logging: false,    // false para não poluir o console com queries SQL
  entities: [User, Movie, UserListItem, Review],
  migrations: [],
  subscribers: [],
});
