import { Movie } from "../models/Movie"
import MovieRepository from "../repository/MovieRepository"


export default class MovieServices {

    static async getAll() {
        return MovieRepository.getAll()
    }

    static async add(movieDTO) {
        this.validate(movieDTO)
        const movieToAdd = new Movie(movieDTO.name, movieDTO.description)
        return MovieRepository.saveMovie(movieToAdd)
    }

    static async getById(id: Number) : Promise<Movie | null> {
        return MovieRepository.getById(id)
    }

    static async searchByName(name) {
        return MovieRepository.searchByName(name)
    }

    static async update(movieDTO) {
        const id = movieDTO.id
        if (!id) {
            throw new Error('O campo id é requerido')
        }

        this.validate(movieDTO)

        let savedMovie = await MovieRepository.getById(id)

        if (!savedMovie && savedMovie != null) {
            throw new Error('Filme não encontrado com esse id')
        }

        savedMovie = {...movieDTO}

        return MovieRepository.saveMovie(savedMovie)

    }


    private static validate(movieDTO) {
        if (!movieDTO.name) {
            throw new Error('O nome do filme é requerido')
        }
    }
}
