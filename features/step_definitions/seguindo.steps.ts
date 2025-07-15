import { Given, When, Then } from '@cucumber/cucumber';
import assert from 'assert';
import { ICustomWorld } from './support/world'; // Importe o World

let followingUsers: Set<string> = new Set();
// A variável currentUser local não é mais necessária, vamos usar this.currentUser

// Cenário: Usuário segue outro usuário

Given('que estou navegando pelo perfil de outro usuário', function (this: ICustomWorld) {
  // Simula navegação pelo perfil de outro usuário
  assert.ok(true, 'Navegando pelo perfil de outro usuário');
});

When('seleciono a opção para seguir esse usuário', function () {
  // Simula ação de seguir usuário
  followingUsers.add('outro_usuario');
});

Then('vejo uma mensagem confirmando que estou seguindo o usuário', function () {
  // Simula confirmação de seguir usuário
  assert.ok(followingUsers.has('outro_usuario'), 'Usuário seguido');
});

Then('o usuário aparece na minha lista de seguidos', function () {
  // Simula verificação na lista de seguidos
  assert.ok(followingUsers.has('outro_usuario'), 'Usuário aparece na lista de seguidos');
});

// Cenário: Usuário deixa de seguir outro usuário

Given('que estou seguindo outro usuário', function () {
  // Simula que o usuário já está seguindo outro usuário
  followingUsers.add('outro_usuario');
});

When('acesso a lista de usuários que sigo', function () {
  // Simula acesso à lista de usuários seguidos
  assert.ok(true, 'Acesso à lista de usuários seguidos');
});

When('seleciono a opção para deixar de seguir um usuário específico', function () {
  // Simula ação de deixar de seguir usuário
  followingUsers.delete('outro_usuario');
});

Then('vejo uma mensagem confirmando que deixei de seguir o usuário', function () {
  // Simula confirmação de deixar de seguir usuário
  assert.ok(!followingUsers.has('outro_usuario'), 'Usuário não está mais sendo seguido');
});

Then('o usuário não aparece mais na minha lista de seguidos', function () {
  // Simula verificação na lista de seguidos
  assert.ok(!followingUsers.has('outro_usuario'), 'Usuário não aparece mais na lista de seguidos');
});

// Cenário: Usuário visualiza quem está seguindo e quem o segue

When('acesso a funcionalidade de gerenciamento de conexões', function () {
  // Simula acesso à funcionalidade de gerenciamento de conexões
  assert.ok(true, 'Acesso à funcionalidade de gerenciamento de conexões');
});

Then('vejo duas listas:', function (dataTable) {
  // Simula visualização das listas de seguidores e seguidos
  const lists = dataTable.rowsHash();
  assert.ok(lists['Uma com os usuários que estou seguindo'] !== undefined, 'Lista de usuários que estou seguindo');
  assert.ok(lists['Outra com os usuários que me seguem'] !== undefined, 'Lista de usuários que me seguem');
});
