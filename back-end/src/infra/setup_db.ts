import "reflect-metadata";
import { DataSource} from "typeorm";
import { Movie } from "../models/Movie";
import { Forum } from "../models/Forum";
import Comment from "../models/Comment";
import { User } from "../models/User";
import { Review } from "../models/Review";
import { UserListItem } from "../models/UserListItem";
import { Notification } from "../models/Notification";

export const AppDataSource = new DataSource({
  type: "postgres",           // or postgres, sqlite, etc.
  host: "127.0.0.1",
  port: 5432,
  username: "postgres",
  password: "asd",
  database: "review_forum",
  synchronize: true, 
  entities: [Movie, Forum, Comment, User, Review, UserListItem, Notification],
});