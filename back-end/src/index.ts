const express = require('express')
const PORT = 8080
const app = express()
const bodyParser = require('body-parser')
import {AppDataSource} from './infra/setup_db'
import forumRouter from './api/ForumApi'
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import MovieRouter from './api/MovieApi'
import endpointsRouter from './api/endpoints'


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


const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'My Express.js API',
        version: '1.0.0',
        description: 'A sample Express.js API built with TypeScript and Swagger',
      },
    },
    apis: ['./src/api/*.ts'],
  }
  const swaggerDocs = swaggerJsdoc(swaggerOptions)
  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

app.use('/api', endpointsRouter)