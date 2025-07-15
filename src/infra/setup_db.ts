import "reflect-metadata";
import { DataSource } from "typeorm";
import { Movie } from "../models/Movie";
import { Forum } from "../models/Forum";


export const AppDataSource = new DataSource({
  type: "postgres",           // or postgres, sqlite, etc.
  host: "127.0.0.1",
  port: 5432,
  username: "postgres",
  password: "asd",
  database: "review_forum",
  synchronize: true,       // auto-creates tables in dev :contentReference[oaicite:2]{index=2}
  entities: [Movie, Forum],
});
