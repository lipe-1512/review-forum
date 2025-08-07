import { AppDataSource } from "../infra/setup_db";
import { UserListItem } from "../models/UserListItem";


export const UserListItemRepository = AppDataSource.getRepository(UserListItem);