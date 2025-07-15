import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import { AppDataSource } from './infra/db';
import mainRouter from './api/routes';

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(bodyParser.json());

// Main Router
app.use('/api', mainRouter);

// Database connection and server initialization
AppDataSource.initialize()
  .then(() => {
    console.log('✅ Fonte de dados inicializada com sucesso!');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Erro durante a inicialização da fonte de dados:', err);
  });
