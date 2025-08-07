import { AppDataSource } from "../infra/setup_db";
import { Notification } from "../models/Notification";

export const NotificationRepository = AppDataSource.getRepository(Notification);
