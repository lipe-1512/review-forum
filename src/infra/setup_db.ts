import "reflect-metadata";
import { DataSource } from "typeorm";
import { Movie } from "../models/Movie";
import { Forum } from "../models/Forum";


// export const AppDataSource = new DataSource({
//   type: "postgres",           // or postgres, sqlite, etc.
//   host: "127.0.0.1",
//   port: 5432,
//   username: "neondb_owner",
//   password: "npg_rcu6dfB0HINb",
//   database: "review_forum",
//   synchronize: true,       // auto-creates tables in dev :contentReference[oaicite:2]{index=2}
//   entities: [Movie, Forum],
// });


export const AppDataSource = new DataSource({
  type: 'postgres',
  url: 'postgresql://neondb_owner:npg_rcu6dfB0HINb@ep-misty-shadow-a850nza6-pooler.eastus2.azure.neon.tech/review_forum?sslmode=require&channel_binding=require',
  synchronize: true,
  entities: [Movie, Forum]
})