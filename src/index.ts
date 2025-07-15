const express = require('express')
const PORT = 8080
const app = express()
const movieRouter = require('./api/MovieApi')
const bodyParser = require('body-parser')
import {AppDataSource} from './infra/setup_db'
import forumRouter from './api/ForumApi'

app.listen(PORT, () => {
    console.log(`Server is running 🚀 on port ${PORT}`)
    AppDataSource.initialize().then(() => {
        console.log('Datasource initialized successfully')
    }).catch((e) => {
        console.error('Fail on initialize datasource')
        console.error(e)
    })
})
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.get('/', (req,res) => {
    res.send('Landing page is up!')
})



app.use('/movies', movieRouter)
app.use('/forums', forumRouter)