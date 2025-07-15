import { Movie } from "../models/Movie"
import MovieRepository from "../repository/MovieRepository"

export default class MovieServices {

    static async getAll() {
        return await MovieRepository.getAll()
    }

    static async save(movieDTO) {
        const movieToAdd = new Movie(movieDTO.name, movieDTO.description)
        return await MovieRepository.saveMovie(movieToAdd)
    }

    static async getById(id: Number) : Promise<Movie | null> {
        return MovieRepository.getById(id)
    }

    static async searchByName(name) {
        return await MovieRepository.searchByName(name)
    }
}
