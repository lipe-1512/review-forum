import { AppDataSource } from "../infra/setup_db";
import { User } from "../models/User";

export const UserRepository = AppDataSource.getRepository(User);

