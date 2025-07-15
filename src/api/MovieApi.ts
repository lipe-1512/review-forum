import { Router, Request, Response } from "express"
import MovieServices from "../services/MovieServices"
const movieRouter = Router()

movieRouter.get('/', async (request, response) => {
    const results = await MovieServices.getAll()
    response.send(results)
})

movieRouter.get('/get-by-id/:id', async (request: Request, response: Response) => {
    const id = request.params['id']
    const result = await MovieServices.getById(Number(id))
    response.send(JSON.stringify(result))
})

movieRouter.get('/search', async(request: Request, response: Response) => {
    let params = request.query
    console.log(params)
    let result = await MovieServices.searchByName(params.name)
    response.send(result)
})

movieRouter.post('/', async (request, response) => {
    const movieDTO = request.body
    const persistedMovie = await MovieServices.save(movieDTO)
    response.send(persistedMovie)
})



module.exports = movieRouter