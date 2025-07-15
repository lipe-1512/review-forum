import { AppDataSource } from '../infra/db';
import { Movie } from '../models/Movie';

export const movieRepository = AppDataSource.getRepository(Movie);
