import { AppDataSource } from '../infra/db';
import { UserListItem } from '../models/UserListItem';

export const userListRepository = AppDataSource.getRepository(UserListItem);
