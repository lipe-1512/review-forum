

import { AppDataSource } from "../infra/setup_db";
import { Review } from "../models/Review";

export const ReviewRepository = AppDataSource.getRepository(Review);