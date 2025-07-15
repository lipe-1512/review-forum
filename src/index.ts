import 'reflect-metadata'; // Deve ser a primeira importação
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { AppDataSource } from './infra/db'; // Usando o arquivo db.ts corrigido
import mainRouter from './api/routes';     // Usando o roteador principal

// ---- Configuração da Aplicação ----
const app = express();
const PORT = process.env.PORT || 3000;

// ---- Middlewares ----
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// ---- Rota de Status ----
app.get('/', (req: Request, res: Response) => {
    res.status(200).send('API do Review Forum está no ar! 🚀');
});

// ---- Documentação Swagger ----
const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Review Forum API',
        version: '1.0.0',
        description: 'Documentação da API para o sistema de reviews e fóruns.',
      },
    },
    apis: ['./src/api/**/*.ts'], // Escaneia todos os arquivos de rotas
  };
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// ---- Rotas Principais da API ----
app.use('/api', mainRouter);

// ---- Inicialização do Servidor e Banco de Dados ----
AppDataSource.initialize()
  .then(() => {
    console.log('✅ Fonte de dados inicializada com sucesso!');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
      console.log(`📚 Documentação da API disponível em http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error('❌ Erro durante a inicialização da fonte de dados:', err);
  });