import { Given } from '@cucumber/cucumber';
import { ICustomWorld } from './world';

Given('que estou autenticado no sistema', async function (this: ICustomWorld) {
  // Simula um usuário que já existe e está logado
  this.currentUser = {
    id: 1,
    name: 'Usuário Autenticado',
    email: 'autenticado@example.com',
  };
  console.log(`- Step: Simulando usuário autenticado: ${this.currentUser.name}`);
});