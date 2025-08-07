import { Review } from "../models/Review";
import { ReviewRepository } from "../repository/ReviewRepository";
import { UserRepository } from "../repository/UserRepository";
import { MovieRepository } from "../repository/MovieRepository";

export class ReviewService {

    //  Cenário 9: Parte da visualização do histórico
    static async getReviewsByUser(userId: number): Promise<Review[]> {
        return await ReviewRepository.find({
            where: { user: { id: userId } },
            relations: ['movie', 'user'], // Carrega dados do filme e usuário
        });
    }

    static async createReview(userId: number, movieId: number, data: { rating: number, comment: string }): Promise<Review> {
        const user = await UserRepository.findOneBy({ id: userId });
        const movie = await MovieRepository.getById(movieId); // Usa método do MovieRepository

        if (!user) throw new Error("Usuário não encontrado.");
        if (!movie) throw new Error("Filme não encontrado.");
        if (data.rating < 1 || data.rating > 5) throw new Error("A avaliação deve ser entre 1 e 5.");
        
        const newReview = ReviewRepository.create({
            user,
            movie,
            rating: data.rating,
            comment: data.comment,
        });
        
        return await ReviewRepository.save(newReview);
    }
}