import { AppDataSource } from '../infra/db'; // ATENÇÃO: Corrigido para apontar para o arquivo de DB correto.
import { Movie } from '../models/Movie';
import { ILike } from 'typeorm';

// Obtém o repositório da entidade Movie a partir da fonte de dados.
const movieRepository = AppDataSource.getRepository(Movie);

/**
 * Classe que encapsula as operações de acesso a dados para a entidade Movie.
 */
export default class MovieRepository {

    /**
     * Retorna todos os filmes do banco de dados.
     */
    static getAll(): Promise<Movie[]> {
        return movieRepository.find();
    }

    /**
     * Encontra um filme pelo seu ID.
     * @param id O ID do filme a ser encontrado.
     * @returns Uma Promise que resolve para o Movie encontrado ou null.
     */
    static getById(id: number): Promise<Movie | null> {
        return movieRepository.findOneBy({ id });
    }

    /**
     * Busca filmes cujo nome corresponda a uma string de busca (case-insensitive).
     * @param name A string de busca para o título do filme.
     * @returns Uma Promise que resolve para um array de Movies.
     */
    static searchByName(name: string): Promise<Movie[]> {
        return movieRepository.find({
            where: {
                title: ILike(`%${name}%`) // Usando ILike para busca case-insensitive
            }
        });
    }

    /**
     * Salva ou atualiza uma entidade de filme no banco de dados.
     * @param movie A entidade Movie a ser salva.
     * @returns Uma Promise que resolve para a entidade Movie salva.
     */
    // Mantendo a sua versão com a tipagem correta
    static saveMovie(movie: Movie): Promise<Movie> {
        return movieRepository.save(movie);
    }
}