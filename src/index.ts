import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import { AppDataSource } from './infra/db'; // Caminho corrigido
import endpointsRouter from './api/endpoints';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.status(200).send('API do Review Forum está no ar! 🚀');
});

const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Review Forum API - Merged',
        version: '1.0.0',
        description: 'Documentação da API para o sistema de reviews e fóruns.',
      },
    },
    apis: ['./src/api/**/*.ts', './src/api/routes/*.ts'],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api', endpointsRouter);

AppDataSource.initialize()
  .then(() => {
    console.log('✅ Fonte de dados inicializada com sucesso!');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((e) => {
    console.error('❌ Erro durante a inicialização da fonte de dados:', e);
  });

export default app;