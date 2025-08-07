import { Review } from "../models/Review";
import { User } from "../models/User";
import { Movie } from "../models/Movie";
import { ReviewRepository } from "../repository/ReviewRepository";
import { UserRepository } from "../repository/UserRepository";
import { MovieRepository } from "../repository/MovieRepository";

export class ReviewService {

    //  Cenário 9: Parte da visualização do histórico de um usuário
    static async getReviewsByUserId(userId: number): Promise<Review[]> {
        const user = await UserRepository.findOneBy({ id: userId });
        if (!user) {
            throw new Error("Usuário não encontrado.");
        }

        return await ReviewRepository.find({
            where: { user: { id: userId } },
            relations: ['movie'], // Carrega os dados do filme junto com a review
            order: { created_at: "DESC" },
        });
    }
    
    // Obter todas as reviews para um filme específico
    static async getReviewsByMovieId(movieId: number): Promise<Review[]> {
        const movie = await MovieRepository.getById(movieId); // Usa método do MovieRepository existente
        if (!movie) {
            throw new Error("Filme não encontrado.");
        }

        return await ReviewRepository.find({
            where: { movie: { id: movieId } },
            relations: ['user'], // Carrega os dados do usuário que fez a review
            order: { created_at: "DESC" },
        });
    }

    // Criar uma nova review
    static async createReview(userId: number, movieId: number, data: { rating: number; comment: string }): Promise<Review> {
        const user = await UserRepository.findOneBy({ id: userId });
        const movie = await MovieRepository.getById(movieId);

        if (!user) throw new Error("Usuário não encontrado.");
        if (!movie) throw new Error("Filme não encontrado.");

        if (data.rating < 1 || data.rating > 5) {
            throw new Error("A avaliação (rating) deve ser um número entre 1 e 5.");
        }

        // Opcional: Verificar se o usuário já fez uma review para este filme
        const existingReview = await ReviewRepository.findOneBy({ user: { id: userId }, movie: { id: movieId } });
        if (existingReview) {
            throw new Error("Você já fez uma avaliação para este filme.");
        }
        
        const review = ReviewRepository.create({
            user,
            movie,
            rating: data.rating,
            comment: data.comment,
        });
        
        return await ReviewRepository.save(review);
    }
    
    // Excluir uma review (apenas o próprio usuário poderia fazer isso)
    static async deleteReview(reviewId: number, userId: number): Promise<void> {
        const review = await ReviewRepository.findOne({ where: { id: reviewId }, relations: ['user'] });
        
        if (!review) {
            throw new Error("Review não encontrada.");
        }
        
        // Validação de permissão
        if (review.user.id !== userId) {
            throw new Error("Você não tem permissão para excluir esta review.");
        }
        
        await ReviewRepository.delete(reviewId);
    }
}