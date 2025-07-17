import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from '../models/User';
import { Movie } from '../models/Movie';
import { Review } from '../models/Review';
import { UserListItem } from '../models/UserListItem';
import { Forum } from "../models/Forum";
import Comment from "../models/Comment";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "127.0.0.1",
  port: 5432,
  username: "postgres",
  password: "123",
  database: "review_forum_db",
  synchronize: true,
  entities: [User, Movie, Review, UserListItem, Forum, Comment], // Todas as entidades
});